"use client";

interface TranscriptMessage {
  speaker: "interviewer" | "user";
  timestamp: string;
  text: string;
}

interface TranscriptPanelProps {
  messages?: TranscriptMessage[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  isCollapsed = false,
  onToggleCollapse,
}: TranscriptPanelProps) {
  // If collapsed, show a vertical tab button
  if (isCollapsed && onToggleCollapse) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <button
          onClick={onToggleCollapse}
          className="h-32 w-full flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all group"
          aria-label="Expand panel"
        >
          <svg
            className="w-5 h-5 transform rotate-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span className="text-xs" style={{ writingMode: "vertical-rl" }}>
            Transcript
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transcript</h1>
          <div className="h-1 w-20 bg-white rounded mt-3"></div>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Messages Container */}
      {!isCollapsed && (
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
                      {message.speaker === "interviewer"
                        ? "Interviewer"
                        : "You"}
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
      )}
    </div>
  );
}
