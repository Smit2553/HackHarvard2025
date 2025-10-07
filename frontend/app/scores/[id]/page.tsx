"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, Code, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { OverallScoreDisplay } from "@/components/scores/overall-score-display";
import { MetricCard } from "@/components/scores/metric-card";
import { KeyMoments } from "@/components/scores/key-moments";
import { SessionTimeline } from "@/components/scores/session-timeline";
import { DetailedFeedback } from "@/components/scores/detailed-feedback";
import { SessionInfoHeader } from "@/components/scores/session-info-header";
import { ScoreActions } from "@/components/scores/score-actions";
import { gradeToScore } from "@/lib/score-utils";

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

export default function ScoreOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const transcriptId = params?.id?.[0];

  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingImprovements, setLoadingImprovements] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = transcriptId
          ? `https://harvardapi.codestacx.com/api/transcript/${transcriptId}`
          : "https://harvardapi.codestacx.com/api/transcript/latest";

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch transcript");

        const data = await response.json();
        setTranscript(data);
      } catch (err) {
        console.error("Error fetching transcript:", err);
        setError("Failed to load transcript");
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [transcriptId]);

  useEffect(() => {
    if (!transcriptId) return;

    const fetchImprovements = async () => {
      try {
        setLoadingImprovements(true);
        const response = await fetch(
          `https://harvardapi.codestacx.com/api/transcript/${transcriptId}/improvements`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch improvement points");
        }
        const data = await response.json();
        setImprovements(data.points || []);
      } catch (err) {
        console.error("Error fetching improvements:", err);
        // Gracefully fail by showing no improvements
        setImprovements([]);
      } finally {
        setLoadingImprovements(false);
      }
    };

    fetchImprovements();
  }, [transcriptId]);

  // Extract scores from ratings or use defaults
  const scores = transcript?.ratings
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
  const strengths = transcript?.ratings?.strengths || [];

  // Convert improvement strings to ImprovementPoint format
  const improvementPoints = improvements.map((point) => ({
    title: "Improvement Area",
    description: point,
    priority: "medium" as const,
  }));

  const average = Math.round(
    (scores.communication + scores.problemSolving + scores.implementation) / 3,
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.push("/profile")}>
              Back to Profile
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
          {/* Back button if viewing specific transcript */}
          {transcriptId && (
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>
          )}

          <SessionInfoHeader
            sessionId={transcript.id}
            createdAt={transcript.created_at}
            duration={transcript.call_duration}
            messageCount={
              transcript.user_messages + transcript.assistant_messages
            }
            isLatest={false}
          />

          {/* Overall Score */}
          <section className="mb-20">
            <OverallScoreDisplay score={average} />

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

          <KeyMoments
            strengths={strengths}
            overallComments={transcript.ratings?.overall_comments || ""}
          />

          <SessionTimeline
            transcript={transcript.transcript}
            loading={loading}
          />

          <DetailedFeedback
            improvements={improvementPoints}
            loading={loadingImprovements}
          />

          <ScoreActions />
        </div>
      </main>
    </div>
  );
}
