"use client";

import { Navigation } from "@/components/navigation";
import { useState, useEffect } from "react";
import { Clock, MessageSquare, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function VisualizationsPage() {
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
      const response = await fetch("http://localhost:8000/api/transcripts");
      if (!response.ok) {
        throw new Error("Failed to fetch transcripts");
      }
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
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTranscriptClick = (transcriptId: number) => {
    // Navigate to a detailed view page with the transcript ID
    router.push(`/visualizations/${transcriptId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Interview Sessions
                </h1>
                <p className="text-lg text-muted-foreground">
                  View and analyze your past interview transcripts
                </p>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                  <p className="text-muted-foreground mt-4">
                    Loading transcripts...
                  </p>
                </div>
              ) : error ? (
                <div className="py-24 text-center">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={fetchTranscripts}
                    className="mt-4 px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : transcripts.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-muted-foreground">
                    No interview sessions found
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Complete an interview to see your transcripts here
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {transcripts.map((transcript) => (
                    <button
                      key={transcript.id}
                      onClick={() => handleTranscriptClick(transcript.id)}
                      className="group p-6 rounded-lg border border-border/50 hover:border-border/100 transition-all text-left hover:bg-muted/30"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">
                                Interview Session #{transcript.id}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transcript.created_at)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-medium">
                              {formatDuration(transcript.call_duration)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              duration
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
                            <MessageSquare className="w-4 h-4" />
                            <span>
                              {transcript.user_messages} user messages
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
                            <MessageSquare className="w-4 h-4" />
                            <span>
                              {transcript.assistant_messages} AI responses
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            Created at{" "}
                            {new Date(transcript.created_at).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:block hidden">
              <div className="sticky top-8 space-y-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h3 className="font-medium">About Visualizations</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Review your past interview sessions to track progress and
                      identify areas for improvement.
                    </p>
                    <p>
                      Click on any session to view the complete transcript and
                      analysis.
                    </p>
                    <p>Sessions are sorted by most recent first.</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h3 className="font-medium">Session Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total sessions
                      </span>
                      <span className="text-sm font-medium">
                        {transcripts.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total practice time
                      </span>
                      <span className="text-sm font-medium">
                        {formatDuration(
                          transcripts.reduce(
                            (sum, t) => sum + t.call_duration,
                            0,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total messages
                      </span>
                      <span className="text-sm font-medium">
                        {transcripts.reduce(
                          (sum, t) =>
                            sum + t.user_messages + t.assistant_messages,
                          0,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-muted/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <h3 className="font-medium text-sm">Quick Actions</h3>
                  </div>
                  <button
                    onClick={fetchTranscripts}
                    className="w-full px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-background transition-colors"
                  >
                    Refresh Sessions
                  </button>
                  <button
                    onClick={() => router.push("/interview")}
                    className="w-full px-4 py-2 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    Start New Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
