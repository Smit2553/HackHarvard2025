"use client";

interface TranscriptMessage {
  speaker: "interviewer" | "user";
  timestamp: string;
  text: string;
}

interface TranscriptPanelProps {
  messages?: TranscriptMessage[];
}

export default function TranscriptPanel({
  messages = [],
}: TranscriptPanelProps) {
  return (
    <div className="flex-1 relative">
      {/* Fade overlay */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      <div className="h-full overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                message.speaker === "interviewer"
                  ? "bg-blue-500"
                  : "bg-green-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                {message.speaker === "interviewer" ? "Offscript" : "You"} •{" "}
                {message.timestamp}
              </div>
              <p className="text-sm leading-relaxed break-words">
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
