"use client";

import { Navigation } from "@/components/navigation";
import { useRouter } from "next/navigation";
import { Building2, TrendingUp, Shuffle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PracticePage() {
  const router = useRouter();

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

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Not sure where to start?{" "}
              <button
                onClick={() => router.push("/interview")}
                className="cursor-pointer underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Try our recommended path
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
