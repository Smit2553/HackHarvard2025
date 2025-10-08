"use client";

import { Navigation } from "@/components/navigation";
import { SimpleFooter } from "@/components/simple-footer";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/progress/stat-card";
import { WeeklyActivity } from "@/components/progress/weekly-activity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  TrendingUp,
  Flame,
  Calendar,
  ArrowRight,
  MessageSquare,
  Brain,
  Code,
  ArrowLeft,
} from "lucide-react";
import { formatDuration, formatTimeAgo } from "@/lib/format";
import { useTranscripts } from "@/hooks/useTranscripts";

export default function ProgressPage() {
  const router = useRouter();
  const [showAllSessions, setShowAllSessions] = useState(false);
  const {
    data: transcripts,
    loading,
    error,
    refetch,
    stats,
  } = useTranscripts();

  const {
    totalPracticeTime,
    avgSessionLength,
    thisWeekSessions,
    currentStreak,
  } = stats;

  const avgScores = {
    communication: 82,
    problemSolving: 78,
    implementation: 85,
  };

  const weeklyProgress = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return days.map((day, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);
      const nextDay = new Date(dayDate);
      nextDay.setDate(dayDate.getDate() + 1);

      const sessionsCount = transcripts.filter((t) => {
        const sessionDate = new Date(t.created_at);
        return sessionDate >= dayDate && sessionDate < nextDay;
      }).length;

      return { day, sessions: sessionsCount };
    });
  }, [transcripts]);

  const displayedTranscripts = showAllSessions
    ? transcripts
    : transcripts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Header */}
          <div className="mb-10">
            <Button
              variant="ghost"
              size="sm"
              className="mb-3"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Your Progress
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Track your interview practice journey
            </p>
          </div>

          {/* Stat strip - plain tiles for consistency */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard
              icon={Clock}
              title="Total Practice"
              value={formatDuration(totalPracticeTime)}
              subtitle={`${transcripts.length} sessions`}
              variant="plain"
            />
            <StatCard
              icon={TrendingUp}
              title="Avg Session"
              value={formatDuration(avgSessionLength)}
              subtitle="Per interview"
              variant="plain"
            />
            <StatCard
              icon={Calendar}
              title="This Week"
              value={thisWeekSessions.toString()}
              subtitle="Sessions"
              variant="plain"
            />
            <StatCard
              icon={Flame}
              title="Current Streak"
              value={currentStreak > 0 ? `${currentStreak} days` : "—"}
              subtitle={currentStreak > 0 ? "Keep it going!" : "Start today"}
              variant="plain"
            />
          </div>

          {/* Performance Breakdown */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              Performance Breakdown
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Communication</span>
                  </div>
                  <span className="text-2xl font-semibold">
                    {avgScores.communication}
                  </span>
                </div>
                <Progress value={avgScores.communication} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Your ability to clearly articulate your thought process
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Problem Solving</span>
                  </div>
                  <span className="text-2xl font-semibold">
                    {avgScores.problemSolving}
                  </span>
                </div>
                <Progress value={avgScores.problemSolving} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  How effectively you break down and approach problems
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Implementation</span>
                  </div>
                  <span className="text-2xl font-semibold">
                    {avgScores.implementation}
                  </span>
                </div>
                <Progress value={avgScores.implementation} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Code quality, correctness, and attention to edge cases
                </p>
              </div>
            </div>
          </section>

          {/* Weekly Activity */}
          <WeeklyActivity weeklyProgress={weeklyProgress} />

          {/* Session History */}
          <section id="session-history">
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Session History</h2>
                <Button onClick={() => router.push("/practice")}>
                  Start New Session
                </Button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-lg border border-border/50 animate-pulse bg-muted/30"
                    />
                  ))}
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={refetch} variant="outline">
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : transcripts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No sessions yet. Time to start practicing!
                    </p>
                    <Button onClick={() => router.push("/practice")}>
                      Start Your First Session
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-3">
                    {displayedTranscripts.map((t, index) => (
                      <button
                        key={t.id}
                        onClick={() => router.push(`/scores/${t.id}`)}
                        className="w-full text-left p-5 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium">
                                Session #{t.id}
                              </span>
                              {index === 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDuration(t.call_duration)} •{" "}
                              {formatTimeAgo(t.created_at, "detailed")}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {transcripts.length > 8 && !showAllSessions && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowAllSessions(true)}
                    >
                      Show All {transcripts.length} Sessions
                    </Button>
                  )}

                  {showAllSessions && transcripts.length > 8 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setShowAllSessions(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Show Less
                    </Button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
