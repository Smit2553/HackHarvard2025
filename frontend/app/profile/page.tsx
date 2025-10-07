"use client";

import { Navigation } from "@/components/navigation";
import { useState, useEffect } from "react";
import { Clock, TrendingUp, Target, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/profile/stat-card";
import { WeeklyActivity } from "@/components/profile/weekly-activity";
import { SessionList } from "@/components/profile/session-list";
import { ProfileHeader } from "@/components/profile/profile-header";

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

  const handleStartSession = () => {
    router.push("/practice");
  };

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
            <StatCard
              icon={Clock}
              title="Total Practice"
              value={formatDuration(totalPracticeTime)}
              subtitle={`Across ${transcripts.length} sessions`}
            />
            <StatCard
              icon={TrendingUp}
              title="Avg Session"
              value={formatDuration(avgSessionLength)}
              subtitle="Per interview"
            />
            <StatCard
              icon={Target}
              title="Current Streak"
              value="3 days"
              subtitle="Keep it going!"
            />
            <StatCard
              icon={Award}
              title="Best Score"
              value="87"
              subtitle="Your highest"
            />
          </div>

          <WeeklyActivity weeklyProgress={weeklyProgress} />

          <div className="mt-12 space-y-4">
            <ProfileHeader onStartSession={handleStartSession} />

            <SessionList
              transcripts={transcripts}
              loading={loading}
              error={error}
              onRetry={fetchTranscripts}
              onStartSession={handleStartSession}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
