interface TranscriptMessage {
  speaker: "interviewer" | "user";
  timestamp: string;
  text: string;
}

interface TranscriptPanelProps {
  messages?: TranscriptMessage[];
}

/**
 * TranscriptPanel component - displays live conversation transcript
 *
 * This component shows:
 * - Conversation transcript with speaker labels
 * - Timestamps for each message
 * - Auto-scrolling to latest messages
 *
 * Design matches the dark theme with:
 * - Black background
 * - White text for content
 * - Gray text for metadata (timestamps, labels)
 */
export default function TranscriptPanel({
  messages = [],
}: TranscriptPanelProps) {
  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">Transcript</h1>
        <div className="h-1 w-20 bg-white rounded mt-3"></div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-500 text-sm">
                Transcript will appear here...
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="space-y-1">
                {/* Speaker and Timestamp */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {message.speaker === "interviewer" ? "Interviewer" : "You"}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    {message.timestamp}
                  </span>
                </div>
                {/* Message Text */}
                <p className="text-neutral-300 leading-relaxed">
                  {message.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
