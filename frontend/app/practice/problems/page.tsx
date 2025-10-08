"use client";

import { Navigation } from "@/components/navigation";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PracticePageLayout } from "@/components/practice/practice-page-layout";
import { PracticeSearch } from "@/components/practice/practice-search";
import { PracticeFilters } from "@/components/practice/practice-filters";
import { PracticeSidebar } from "@/components/practice/practice-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/pagination";
import { Problem, Transcript } from "@/lib/types";
import { formatDuration } from "@/lib/format";

const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    acceptance: 49,
    frequency: 95,
    topics: ["Array", "Hash Table"],
    companies: ["Google", "Amazon", "Meta"],
  },
  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "medium",
    acceptance: 42,
    frequency: 88,
    topics: ["Linked List", "Math", "Recursion"],
    companies: ["Microsoft", "Amazon"],
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    acceptance: 37,
    frequency: 72,
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    companies: ["Google", "Meta"],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    acceptance: 35,
    frequency: 90,
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Amazon", "Bloomberg", "Adobe"],
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "easy",
    acceptance: 72,
    frequency: 85,
    topics: ["Linked List", "Recursion"],
    companies: ["Apple", "Meta", "Microsoft"],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    acceptance: 40,
    frequency: 82,
    topics: ["String", "Stack"],
    companies: ["Amazon", "Meta", "Bloomberg"],
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "hard",
    acceptance: 51,
    frequency: 78,
    topics: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
    companies: ["Google", "Amazon", "Uber"],
  },
  {
    id: "binary-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    acceptance: 65,
    frequency: 80,
    topics: ["Tree", "BFS"],
    companies: ["Meta", "Amazon", "Microsoft"],
  },
  {
    id: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    acceptance: 68,
    frequency: 85,
    topics: ["Array", "Heap", "Sorting", "Quickselect"],
    companies: ["Meta", "Amazon", "Apple"],
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "medium",
    acceptance: 67,
    frequency: 80,
    topics: ["Array", "Prefix Sum"],
    companies: ["Microsoft", "Uber", "Amazon"],
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "medium",
    acceptance: 43,
    frequency: 75,
    topics: ["Design", "Hash Table", "Linked List"],
    companies: ["Google", "Meta", "Amazon"],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    acceptance: 54,
    frequency: 90,
    topics: ["Dynamic Programming", "Math"],
    companies: ["Adobe", "Apple"],
  },
];

type SortOption = "alphabetical" | "difficulty";
const ITEMS_PER_PAGE = 8;

export default function ProblemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
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
  }, [searchQuery, selectedDifficulty, selectedTopic, selectedCompany]);

  const allTopics = useMemo(
    () => Array.from(new Set(problems.flatMap((p) => p.topics))).sort(),
    [],
  );
  const allCompanies = useMemo(
    () => Array.from(new Set(problems.flatMap((p) => p.companies))).sort(),
    [],
  );

  const filteredAndSortedProblems = useMemo(() => {
    const filtered = problems.filter((problem) => {
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        problem.difficulty === selectedDifficulty;
      const matchesTopic =
        selectedTopic === "all" || problem.topics.includes(selectedTopic);
      const matchesCompany =
        selectedCompany === "all" ||
        problem.companies.includes(selectedCompany);
      const matchesSearch =
        searchQuery === "" ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.topics.some((topic) =>
          topic.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        problem.companies.some((company) =>
          company.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return (
        matchesDifficulty && matchesTopic && matchesCompany && matchesSearch
      );
    });

    filtered.sort((a, b) => {
      if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
      if (sortBy === "difficulty") {
        const order: Record<Problem["difficulty"], number> = {
          easy: 0,
          medium: 1,
          hard: 2,
        };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedDifficulty, selectedTopic, selectedCompany, sortBy]);

  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSortedProblems.slice(start, end);
  }, [currentPage, filteredAndSortedProblems]);

  const totalPages = Math.ceil(
    filteredAndSortedProblems.length / ITEMS_PER_PAGE,
  );

  const difficultyStats = {
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  };

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
                  title: "How to approach",
                  content: (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Start with easy problems to build confidence and
                        momentum.
                      </p>
                      <p>
                        Focus on understanding patterns rather than memorizing
                        solutions.
                      </p>
                      <p>
                        Practice explaining your approach out loud as you code.
                      </p>
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
                { id: "two-sum", title: "Two Sum", subtitle: "Easy • Array" },
                {
                  id: "reverse-linked-list",
                  title: "Reverse Linked List",
                  subtitle: "Easy • Linked List",
                },
                {
                  id: "valid-parentheses",
                  title: "Valid Parentheses",
                  subtitle: "Easy • Stack",
                },
              ]}
              onPopularClick={(id) => router.push(`/interview?problemId=${id}`)}
            />
          }
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              All problems
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse and filter {problems.length} practice problems
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <PracticeFilters
              options={[
                { value: "all", label: "All", count: problems.length },
                { value: "easy", label: "Easy", count: difficultyStats.easy },
                {
                  value: "medium",
                  label: "Medium",
                  count: difficultyStats.medium,
                },
                { value: "hard", label: "Hard", count: difficultyStats.hard },
              ]}
              selected={selectedDifficulty}
              onSelect={setSelectedDifficulty}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {allTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All companies</SelectItem>
                  {allCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphabetical">
                    Alphabetical (A-Z)
                  </SelectItem>
                  <SelectItem value="difficulty">
                    Difficulty (Easy to Hard)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8">
            <PracticeSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search problems, topics, or companies..."
            />
          </div>

          <div className="grid gap-4">
            {paginatedProblems.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-muted-foreground">
                  No problems match your filters
                </p>
              </div>
            ) : (
              paginatedProblems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() =>
                    router.push(`/interview?problemId=${problem.id}`)
                  }
                  className="cursor-pointer group p-6 rounded-lg border border-border/50 hover:border-border transition-all text-left hover:bg-muted/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">
                            {problem.title}
                          </h3>
                          <span className="text-xs capitalize px-1.5 py-0.5 rounded bg-foreground text-background flex-shrink-0">
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Asked by {problem.companies.slice(0, 3).join(", ")}
                          {problem.companies.length > 3 &&
                            ` +${problem.companies.length - 3} more`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {problem.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-1 rounded-md bg-muted"
                        >
                          {topic}
                        </span>
                      ))}
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
              totalItems={filteredAndSortedProblems.length}
            />
          )}
        </PracticePageLayout>
      </main>
    </div>
  );
}
