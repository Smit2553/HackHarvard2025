"use client";

import { Navigation } from "@/components/navigation";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PracticePageLayout } from "@/components/practice/practice-page-layout";
import { PracticeSearch } from "@/components/practice/practice-search";
import { PracticeFilters } from "@/components/practice/practice-filters";
import { PracticeSidebar } from "@/components/practice/practice-sidebar";
import { Pagination } from "@/components/pagination";
import { Company, Transcript } from "@/lib/types";
import { formatDuration } from "@/lib/format";

const companies: Company[] = [
  {
    id: "google",
    name: "Google",
    problems: 142,
    difficulty: { easy: 35, medium: 67, hard: 40 },
    topics: ["Arrays", "Dynamic Programming", "Graph Theory", "System Design"],
    description: "Known for algorithmic depth and optimization problems",
    avgTime: "45 min",
    trending: true,
  },
  {
    id: "meta",
    name: "Meta",
    problems: 98,
    difficulty: { easy: 22, medium: 48, hard: 28 },
    topics: [
      "Binary Trees",
      "Graph Traversal",
      "Dynamic Programming",
      "Strings",
    ],
    description: "Focus on coding speed and communication skills",
    avgTime: "45 min",
    trending: true,
  },
  {
    id: "amazon",
    name: "Amazon",
    problems: 127,
    difficulty: { easy: 41, medium: 62, hard: 24 },
    topics: ["Arrays", "Trees", "Design", "Leadership Principles"],
    description: "Behavioral questions mixed with technical challenges",
    avgTime: "60 min",
    trending: true,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    problems: 89,
    difficulty: { easy: 28, medium: 43, hard: 18 },
    topics: ["Arrays", "Linked Lists", "Trees", "System Design"],
    description: "Problem-solving approach and code quality matter",
    avgTime: "45 min",
    trending: false,
  },
  {
    id: "apple",
    name: "Apple",
    problems: 76,
    difficulty: { easy: 19, medium: 38, hard: 19 },
    topics: ["Trees", "Design Patterns", "Recursion", "iOS/Systems"],
    description: "Domain-specific knowledge and attention to detail",
    avgTime: "50 min",
    trending: false,
  },
  {
    id: "netflix",
    name: "Netflix",
    problems: 43,
    difficulty: { easy: 8, medium: 22, hard: 13 },
    topics: ["System Design", "Distributed Systems", "Algorithms"],
    description: "Culture fit and real-world scalability problems",
    avgTime: "45 min",
    trending: false,
  },
  {
    id: "uber",
    name: "Uber",
    problems: 65,
    difficulty: { easy: 15, medium: 32, hard: 18 },
    topics: ["Graphs", "Dynamic Programming", "System Design", "Maps"],
    description: "Location-based services and optimization",
    avgTime: "45 min",
    trending: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    problems: 38,
    difficulty: { easy: 7, medium: 19, hard: 12 },
    topics: ["API Design", "Systems", "Payments", "Security"],
    description: "Practical coding with focus on reliability",
    avgTime: "60 min",
    trending: true,
  },
];

const ITEMS_PER_PAGE = 6;

export default function CompanyPracticePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const response = await fetch(
          "https://harvardapi.codestacx.com/api/transcripts",
        );
        if (response.ok) {
          const data = await response.json();
          setTranscripts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    void fetchTranscripts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  const filteredCompanies = useMemo(() => {
    let filtered = companies;

    if (selectedFilter === "trending") {
      filtered = filtered.filter((c) => c.trending);
    } else if (selectedFilter === "beginner") {
      filtered = filtered.filter((c) => c.difficulty.easy > c.difficulty.hard);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.topics.some((topic) =>
            topic.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    return filtered;
  }, [searchQuery, selectedFilter]);

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCompanies.slice(start, end);
  }, [currentPage, filteredCompanies]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

  const totalPracticeTime = transcripts.reduce(
    (sum, t) => sum + (t.call_duration || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">
        <PracticePageLayout
          sidebar={
            <PracticeSidebar
              sections={[
                {
                  title: "How to choose",
                  content: (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        If you have an upcoming interview, start with that
                        specific company.
                      </p>
                      <p>
                        Otherwise, Google and Meta problems cover most common
                        patterns.
                      </p>
                      <p>For system design focus, try Netflix or Uber.</p>
                    </div>
                  ),
                },
              ]}
              showProgress
              progressData={{
                sessionsCompleted: transcripts.length,
                problemsSolved: transcripts.length,
                practiceTime: formatDuration(totalPracticeTime),
              }}
              showPopular
              popularItems={[
                { id: "google", title: "Google", subtitle: "Most practiced" },
                { id: "meta", title: "Meta", subtitle: "Trending" },
                { id: "amazon", title: "Amazon", subtitle: "High demand" },
              ]}
              onPopularClick={(id) => router.push(`/interview?company=${id}`)}
            />
          }
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Choose a company
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice with real interview questions
            </p>
          </div>

          <div className="mb-6">
            <PracticeFilters
              options={[
                { value: "all", label: "All companies" },
                { value: "trending", label: "Trending" },
                { value: "beginner", label: "Beginner friendly" },
              ]}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
          </div>

          <div className="mb-8">
            <PracticeSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search companies or topics..."
            />
          </div>

          <div className="grid gap-4">
            {paginatedCompanies.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-muted-foreground">No companies found</p>
              </div>
            ) : (
              paginatedCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() =>
                    router.push(`/interview?company=${company.id}`)
                  }
                  className="cursor-pointer group p-6 rounded-lg border border-border/50 hover:border-border transition-all text-left hover:bg-muted/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">
                            {company.name}
                          </h3>
                          {company.trending && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-foreground text-background">
                              Trending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {company.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">
                          {company.problems}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          problems
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-md bg-muted"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>
                        {company.difficulty.easy} Easy •{" "}
                        {company.difficulty.medium} Medium •{" "}
                        {company.difficulty.hard} Hard
                      </span>
                      <span>{company.avgTime} avg</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredCompanies.length}
            />
          )}
        </PracticePageLayout>
      </main>
    </div>
  );
}
