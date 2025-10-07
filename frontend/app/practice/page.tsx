"use client";

import { Navigation } from "@/components/navigation";
import { useRouter } from "next/navigation";
import { Building2, TrendingUp, Shuffle } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PracticePage() {
  const router = useRouter();
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://harvardapi.codestacx.com";

  const handleScrapeLeetCode = async () => {
    if (!leetcodeUrl.trim()) {
      setError("Please enter a LeetCode URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Scraping LeetCode problem:", leetcodeUrl);

      const response = await fetch(
        `${API_URL}/api/scrape_leetcode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: leetcodeUrl }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to scrape problem");
      }

      const data = await response.json();
      console.log("✅ Scraped problem:", data);

      // Navigate to interview page with problem ID
      router.push(`/interview?problemId=${data.problem_id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("❌ Error scraping LeetCode:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const practiceOptions = [
    {
      id: "companies",
      title: "Company based",
      description:
        "Practice problems from specific companies you're interviewing with",
      icon: Building2,
      stats: "Google, Meta, Amazon, and 150+ more",
      href: "/practice/companies",
    },
    {
      id: "difficulty",
      title: "Difficulty based",
      description: "Start easy and work your way up to harder problems",
      icon: TrendingUp,
      stats: "Easy (15 min) • Medium (25 min) • Hard (45 min)",
      href: "/practice/companies", // Temporary until we have a dedicated difficulty page
    },
    {
      id: "random",
      title: "Free pick",
      description: "Browse all problems or let us pick one randomly",
      icon: Shuffle,
      stats: "500+ problems across all topics",
      href: "/practice/companies", // Temporary until we have a dedicated random page
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center py-12 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              How do you want to practice?
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Choose your path. You can always switch later.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {practiceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.id}
                  className="cursor-pointer hover:bg-muted/50 transition-all"
                  onClick={() => router.push(option.href)}
                >
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {option.stats}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 max-w-2xl mx-auto">
            <div className="border-t pt-12">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Have your own problem?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Paste a LeetCode URL to practice with a specific problem
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  value={leetcodeUrl}
                  onChange={(e) => setLeetcodeUrl(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      handleScrapeLeetCode();
                    }
                  }}
                />
                <Button
                  onClick={handleScrapeLeetCode}
                  disabled={isLoading || !leetcodeUrl.trim()}
                  className="sm:w-auto w-full"
                >
                  {isLoading ? "Loading..." : "Start Interview"}
                </Button>
              </div>

              {error && (
                <p className="text-sm text-destructive mt-3 text-center">
                  {error}
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center mt-4">
                Works with any LeetCode problem URL
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
