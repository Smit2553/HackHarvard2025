"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";
import {
  TrendingUp,
  MessageSquare,
  Code,
  Lightbulb,
  User,
  Bot,
  Clock,
} from "lucide-react";

interface TranscriptSegment {
  type: "transcript" | "call-start" | "call-end";
  role?: "user" | "assistant";
  text?: string;
  timestamp: string;
  secondsSinceStart: number;
}

interface Transcript {
  id: number;
  transcript: TranscriptSegment[];
  call_duration: number;
  user_messages: number;
  assistant_messages: number;
  metadata: any;
  created_at: string;
}

type Props = {
  communicationScore?: number;
  problemSolvingScore?: number;
  implementationScore?: number;
  improvements?: string[];
};

export default function ScoreOverviewPage({
  communicationScore = 82,
  problemSolvingScore = 75,
  implementationScore = 90,
  improvements = [
    "Improvement 1 placeholder",
    "Improvement 2 placeholder",
    "Improvement 3 placeholder",
  ],
}: Props) {
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchLatestTranscript();
  }, []);

  const fetchLatestTranscript = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://harvardapi.codestacx.com/api/transcript/latest",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }
      const data = await response.json();
      setTranscript(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setError("No transcript available");
    } finally {
      setLoading(false);
    }
  };

  const average = Math.round(
    (communicationScore + problemSolvingScore + implementationScore) / 3,
  );

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const MetricCard: React.FC<{
    title: string;
    score: number;
    icon: React.ReactNode;
    explanation?: string;
  }> = ({ title, score, icon, explanation }) => {
    const pct = Math.max(0, Math.min(100, score));
    return (
      <div className="p-6 rounded-lg border border-border/50 hover:border-border/100 transition-all bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">{icon}</div>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <div className="text-2xl font-semibold">{score}</div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
          <div
            className={`h-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Analysis:</p>
          <p className="text-sm">{explanation || "No details provided."}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Interview Performance
            </h1>
            <p className="text-lg text-muted-foreground">
              Review your scores and insights from the latest session
            </p>
          </header>

          <section className="flex flex-col items-center mb-12">
            {/* Overall Score Display */}
            <div className="mb-12">
              <div className="relative w-56 h-56 rounded-full border-8 border-border/50 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    Overall Score
                  </div>
                  <div className="text-5xl font-bold mb-1">{average}</div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>
              </div>
            </div>

            {/* Three metrics */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Communication"
                score={communicationScore}
                icon={<MessageSquare className="w-5 h-5" />}
                explanation="Your ability to clearly articulate your thought process and approach."
              />
              <MetricCard
                title="Problem Solving"
                score={problemSolvingScore}
                icon={<TrendingUp className="w-5 h-5" />}
                explanation="How effectively you broke down and approached the problem."
              />
              <MetricCard
                title="Implementation"
                score={implementationScore}
                icon={<Code className="w-5 h-5" />}
                explanation="Code quality, correctness, and attention to edge cases."
              />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Session Timeline</h2>

            {loading ? (
              <div className="p-12 rounded-lg border border-border/50 bg-background text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                <p className="text-muted-foreground mt-4">
                  Loading transcript...
                </p>
              </div>
            ) : error || !transcript ? (
              <div className="p-12 rounded-lg border border-border/50 bg-background text-center">
                <p className="text-muted-foreground">
                  {error || "No transcript available"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transcript.transcript
                  .filter((segment) => segment.type === "transcript")
                  .map((segment, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedSegmentIndex(
                          selectedSegmentIndex === index ? null : index,
                        )
                      }
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedSegmentIndex === index
                          ? segment.role === "user"
                            ? "border-blue-500/50 bg-blue-500/5"
                            : "border-purple-500/50 bg-purple-500/5"
                          : "border-border/50 hover:border-border/100 bg-background hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            segment.role === "user"
                              ? "bg-blue-500/20"
                              : "bg-purple-500/20"
                          }`}
                        >
                          {segment.role === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {segment.role === "user" ? "You" : "AI Assistant"}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatTimestamp(segment.secondsSinceStart)}
                              </span>
                            </div>
                          </div>
                          <p
                            className={`text-sm ${
                              selectedSegmentIndex === index
                                ? ""
                                : "line-clamp-2"
                            }`}
                          >
                            {segment.text}
                          </p>
                          {selectedSegmentIndex !== index &&
                            segment.text &&
                            segment.text.length > 100 && (
                              <span className="text-xs text-muted-foreground mt-1 inline-block">
                                Click to expand...
                              </span>
                            )}
                        </div>
                      </div>
                    </button>
                  ))}

                {transcript.transcript.filter((s) => s.type === "transcript")
                  .length === 0 && (
                  <div className="p-12 rounded-lg border border-border/50 bg-background text-center">
                    <p className="text-muted-foreground">
                      No conversation messages in this transcript
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Key Improvements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {improvements.map((imp, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </div>
                    <h4 className="font-medium">Area for Growth</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{imp}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex justify-center gap-4">
            <button className="px-6 py-3 rounded-lg border border-border/50 hover:border-border/100 transition-colors">
              Review Transcript
            </button>
            <button className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors">
              Start New Interview
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
