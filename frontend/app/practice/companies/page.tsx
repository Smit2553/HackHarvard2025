"use client";

import { Navigation } from "@/components/navigation";
import { useState, useMemo } from "react";
import { Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const companies = [
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

export default function CompanyPracticePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Choose a company
                </h1>
                <p className="text-lg text-muted-foreground">
                  Practice with real interview questions
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedFilter === "all"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All companies
                </button>
                <button
                  onClick={() => setSelectedFilter("trending")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedFilter === "trending"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setSelectedFilter("beginner")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedFilter === "beginner"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Beginner friendly
                </button>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search companies or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border/50 rounded-lg bg-transparent focus:outline-none focus:border-border transition-colors"
                />
              </div>

              <div className="grid gap-4">
                {filteredCompanies.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="text-muted-foreground">No companies found</p>
                  </div>
                ) : (
                  filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => router.push(`/interview`)}
                      className="group p-6 rounded-lg border border-border/50 hover:border-border/100 transition-all text-left hover:bg-muted/30"
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
            </div>

            <div className="lg:block hidden">
              <div className="sticky top-8 space-y-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h3 className="font-medium">How to choose</h3>
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
                </div>

                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h3 className="font-medium">Your progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Sessions completed
                      </span>
                      <span className="text-sm font-medium">28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Problems solved
                      </span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Practice time
                      </span>
                      <span className="text-sm font-medium">21 hrs</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-muted/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <h3 className="font-medium text-sm">
                      Most practiced this week
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Google</span>
                      <span className="text-muted-foreground">
                        2.3k sessions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meta</span>
                      <span className="text-muted-foreground">
                        1.8k sessions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amazon</span>
                      <span className="text-muted-foreground">
                        1.5k sessions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
