import { Calendar, Clock, MessageSquare } from "lucide-react";

interface SessionInfoHeaderProps {
  sessionId?: number;
  createdAt: string;
  duration: number;
  messageCount: number;
  isLatest?: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function SessionInfoHeader({
  sessionId,
  createdAt,
  duration,
  messageCount,
  isLatest = false,
}: SessionInfoHeaderProps) {
  return (
    <header className="mb-16">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          {isLatest ? "Latest Interview Performance" : `Session #${sessionId}`}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isLatest
            ? "Here's how you did in your latest practice session"
            : "Performance breakdown for this session"}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Duration: {formatTime(duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>{messageCount} messages</span>
        </div>
      </div>
    </header>
  );
}
