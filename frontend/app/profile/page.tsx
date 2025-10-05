// app/profile/page.tsx (rename from visualizations)
"use client";

import { Navigation } from "@/components/navigation";
import { useState, useEffect } from "react";
import {
  Clock,
  TrendingUp,
  ChevronRight,
  Target,
  Award,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  metadata: Record<string, unknown>;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://harvardapi.codestacx.com/api/transcripts",
      );
      if (!response.ok) throw new Error("Failed to fetch transcripts");
      const data = await response.json();
      setTranscripts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transcripts:", err);
      setError("Failed to load transcripts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const totalPracticeTime = transcripts.reduce(
    (sum, t) => sum + t.call_duration,
    0,
  );
  const avgSessionLength =
    transcripts.length > 0 ? totalPracticeTime / transcripts.length : 0;

  // Mock data for progress - in real app, this would be calculated from transcripts
  const weeklyProgress = [
    { day: "Mon", sessions: 2 },
    { day: "Tue", sessions: 1 },
    { day: "Wed", sessions: 3 },
    { day: "Thu", sessions: 0 },
    { day: "Fri", sessions: 2 },
    { day: "Sat", sessions: 1 },
    { day: "Sun", sessions: 0 },
  ];

  const maxSessions = Math.max(...weeklyProgress.map((d) => d.sessions));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Your Progress
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your interview practice journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatDuration(totalPracticeTime)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {transcripts.length} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Avg Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatDuration(avgSessionLength)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per interview
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">3 days</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep it going!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Best Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">87</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your highest
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                This Week&#39;s Activity
              </CardTitle>
              <CardDescription>Sessions completed each day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {weeklyProgress.map((day) => (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-muted rounded-t flex flex-col justify-end"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="bg-foreground rounded-t transition-all duration-300"
                        style={{
                          height: `${(day.sessions / maxSessions) * 100 || 5}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Sessions</h2>
              <Button onClick={() => router.push("/practice")}>
                Start New Session
              </Button>
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                <p className="text-muted-foreground mt-4">
                  Loading sessions...
                </p>
              </div>
            ) : error ? (
              <div className="py-24 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                  onClick={fetchTranscripts}
                  variant="outline"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : transcripts.length === 0 ? (
              <Card className="py-24 text-center">
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    No sessions yet. Time to start practicing!
                  </p>
                  <Button onClick={() => router.push("/practice")}>
                    Start Your First Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {transcripts.slice(0, 5).map((transcript) => (
                  <Card
                    key={transcript.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => router.push(`/scores/${transcript.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4">
                            <h3 className="font-medium">
                              Session #{transcript.id}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(transcript.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {formatDuration(transcript.call_duration)}
                            </span>
                            <span>•</span>
                            <span>
                              {transcript.user_messages +
                                transcript.assistant_messages}{" "}
                              messages
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {transcripts.length > 5 && (
                  <Button variant="outline" className="w-full">
                    View All Sessions
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
