"use client";

import { Navigation } from "@/components/navigation";
import { useState, useEffect } from "react";
import {
  Clock,
  MessageSquare,
  Calendar,
  ArrowLeft,
  User,
  Bot,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

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

export default function TranscriptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transcriptId = params?.id as string;

  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transcriptId) {
      fetchTranscript();
    }
  }, [transcriptId]);

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://harvardapi.codestacx.com/api/transcript/${transcriptId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }
      const data = await response.json();
      setTranscript(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setError("Failed to load transcript. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            <p className="text-muted-foreground mt-4">Loading transcript...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !transcript) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">{error || "Transcript not found"}</p>
            <button
              onClick={() => router.push("/visualizations")}
              className="mt-4 px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
            >
              Back to Sessions
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <button
            onClick={() => router.push("/visualizations")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sessions</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Interview Session #{transcript.id}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(transcript.created_at).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Duration: {formatDuration(transcript.call_duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>
                  {transcript.user_messages + transcript.assistant_messages}{" "}
                  messages
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            <div className="p-6 rounded-lg border border-border/50 space-y-4">
              <h2 className="text-lg font-medium">Session Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-semibold">
                    {transcript.user_messages}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    User messages
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {transcript.assistant_messages}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    AI responses
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {formatDuration(transcript.call_duration)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total duration
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {
                      transcript.transcript.filter(
                        (s) => s.type === "transcript",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total exchanges
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-4">
              Conversation Transcript
            </h2>
            {transcript.transcript
              .filter((segment) => segment.type === "transcript")
              .map((segment, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    segment.role === "user"
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-purple-500/30 bg-purple-500/5"
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
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {segment.role === "user" ? "You" : "AI Assistant"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(segment.secondsSinceStart)}
                        </span>
                      </div>
                      <p className="text-sm">{segment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {transcript.transcript.filter((s) => s.type === "transcript")
            .length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>No conversation messages in this transcript</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
