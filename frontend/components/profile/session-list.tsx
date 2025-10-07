"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transcript {
  id: number;
  call_duration: number;
  user_messages: number;
  assistant_messages: number;
  created_at: string;
}

interface SessionListProps {
  transcripts: Transcript[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onStartSession: () => void;
}

export function SessionList({
  transcripts,
  loading,
  error,
  onRetry,
  onStartSession,
}: SessionListProps) {
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        <p className="text-muted-foreground mt-4">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={onRetry} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (transcripts.length === 0) {
    return (
      <Card className="py-24 text-center">
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No sessions yet. Time to start practicing!
          </p>
          <Button onClick={onStartSession}>Start Your First Session</Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
                  <h3 className="font-medium">Session #{transcript.id}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(transcript.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDuration(transcript.call_duration)}</span>
                  <span>•</span>
                  <span>
                    {transcript.user_messages + transcript.assistant_messages}{" "}
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
  );
}
