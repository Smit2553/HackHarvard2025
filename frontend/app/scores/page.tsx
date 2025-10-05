"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  MessageSquare,
  Code,
  CheckCircle2,
  AlertCircle,
  Target,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface TranscriptSegment {
  type: "transcript" | "call-start" | "call-end";
  role?: "user" | "assistant";
  text?: string;
  timestamp: string;
  secondsSinceStart: number;
}

interface Rating {
  communication_grade: string;
  communication_feedback: string;
  problem_solving_grade: string;
  problem_solving_feedback: string;
  implementation_grade: string;
  implementation_feedback: string;
  overall_comments: string;
  strengths: string[];
}

interface Transcript {
  id: number;
  transcript: TranscriptSegment[];
  call_duration: number;
  user_messages: number;
  assistant_messages: number;
  metadata: Record<string, unknown>;
  created_at: string;
  ratings?: Rating | null;
}

// Convert letter grade to numeric score with randomized range
const gradeToScore = (grade: string): number => {
  const gradeRanges: Record<string, [number, number]> = {
    "A+": [96, 100],
    A: [91, 95],
    "A-": [88, 90],
    "B+": [85, 87],
    B: [81, 84],
    "B-": [78, 80],
    "C+": [75, 77],
    C: [71, 74],
    "C-": [68, 70],
    D: [60, 67],
    F: [40, 59],
  };

  const range = gradeRanges[grade];
  if (!range) return 75; // Default to 75 if grade not recognized

  // Generate random number within the range
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function ScoreOverviewPage() {
  const router = useRouter();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestTranscript();
  }, []);

  const fetchLatestTranscript = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate minimum loading time for better UX
      const [response] = await Promise.all([
        fetch("https://harvardapi.codestacx.com/api/transcript/latest"),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (!response.ok) throw new Error("Failed to fetch transcript");
      const data = await response.json();
      setTranscript(data);
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setError("Unable to load your interview results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Processing your interview...
              </h2>
              <p className="text-sm text-muted-foreground">
                Analyzing your performance and generating feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error || !transcript) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Unable to load results</h2>
              <p className="text-sm text-muted-foreground">
                {error ||
                  "No interview data found. Complete an interview first to see your results."}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => fetchLatestTranscript()}>
                Try Again
              </Button>
              <Button onClick={() => router.push("/practice")}>
                Start New Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract scores from ratings or use defaults
  const scores = transcript.ratings
    ? {
        communication: gradeToScore(transcript.ratings.communication_grade),
        problemSolving: gradeToScore(transcript.ratings.problem_solving_grade),
        implementation: gradeToScore(transcript.ratings.implementation_grade),
      }
    : {
        communication: 75,
        problemSolving: 75,
        implementation: 75,
      };

  // Extract strengths from ratings
  const strengths = transcript.ratings?.strengths || [];

  // Generate improvement suggestions from feedback
  const improvements = transcript.ratings
    ? [
        {
          title: "Communication",
          description: transcript.ratings.communication_feedback,
          priority: scores.communication < 80 ? "high" : "medium",
        },
        {
          title: "Problem Solving",
          description: transcript.ratings.problem_solving_feedback,
          priority: scores.problemSolving < 80 ? "high" : "medium",
        },
        {
          title: "Implementation",
          description: transcript.ratings.implementation_feedback,
          priority: scores.implementation < 80 ? "high" : "medium",
        },
      ]
    : [];

  const average = Math.round(
    (scores.communication + scores.problemSolving + scores.implementation) / 3,
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80)
      return { text: "Excellent", color: "text-green-600 dark:text-green-400" };
    if (score >= 60)
      return { text: "Good", color: "text-yellow-600 dark:text-yellow-400" };
    return { text: "Needs work", color: "text-red-600 dark:text-red-400" };
  };

  const MetricCard: React.FC<{
    title: string;
    score: number;
    icon: React.ReactNode;
    explanation?: string;
  }> = ({ title, score, icon, explanation }) => {
    const status = getScoreStatus(score);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">{icon}</div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-semibold">{score}</span>
              <span className={`text-sm ${status.color}`}>{status.text}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          {explanation && (
            <p className="text-sm text-muted-foreground">{explanation}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          {/* Header */}
          <header className="mb-16 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Interview Performance
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&#39;s how you did in your latest practice session
            </p>
          </header>

          {/* Overall Score */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <div className="inline-flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Overall Score
                </div>
                <div className="text-6xl md:text-7xl font-bold tracking-tight">
                  {average}
                </div>
                <div className="text-lg text-muted-foreground mt-1">
                  out of 100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Communication"
                score={scores.communication}
                icon={<MessageSquare className="w-4 h-4" />}
                explanation="Your ability to clearly articulate your thought process and approach."
              />
              <MetricCard
                title="Problem Solving"
                score={scores.problemSolving}
                icon={<TrendingUp className="w-4 h-4" />}
                explanation="How effectively you broke down and approached the problem."
              />
              <MetricCard
                title="Implementation"
                score={scores.implementation}
                icon={<Code className="w-4 h-4" />}
                explanation="Code quality, correctness, and attention to edge cases."
              />
            </div>
          </section>

          {/* Highlights & Feedback */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-8">Key Moments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    What went well
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {strengths.length > 0 ? (
                    <ul className="space-y-3">
                      {strengths.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific strengths identified in this session
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Overall Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {transcript.ratings?.overall_comments ||
                      "No specific feedback available for this session"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Session Timeline */}
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-8">Session Timeline</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transcript.transcript
                    .filter((s) => s.type === "transcript")
                    .map((segment, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            segment.role === "user"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {segment.role === "user" ? "You" : "Offscript"} •{" "}
                            {formatTime(segment.secondsSinceStart)}
                          </div>
                          <p className="text-sm">{segment.text}</p>
                        </div>
                      </div>
                    ))}

                  {transcript.transcript.filter((s) => s.type === "transcript")
                    .length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No conversation messages in this transcript
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Detailed Feedback */}
          {improvements.length > 0 && (
            <section className="mb-20">
              <h2 className="text-2xl font-semibold mb-8">Detailed Feedback</h2>
              <div className="space-y-4">
                {improvements.map((improvement, i) => (
                  <Card
                    key={i}
                    className={
                      improvement.priority === "high"
                        ? "border-orange-500/20"
                        : ""
                    }
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            improvement.priority === "high"
                              ? "bg-orange-500/10"
                              : "bg-muted"
                          }`}
                        >
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">
                            {improvement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {improvement.description}
                          </p>
                        </div>
                        {improvement.priority === "high" && (
                          <span className="text-xs px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            High priority
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <section className="flex justify-center gap-4">
            <Button variant="outline" size="lg">
              Download Full Report
            </Button>
            <Button size="lg" onClick={() => router.push("/practice")}>
              Start New Interview
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
