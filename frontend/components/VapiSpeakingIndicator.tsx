"use client";

import { useVapi } from "./VapiProvider";

/**
 * VapiSpeakingIndicator - Visual indicator that shows when the AI agent is speaking
 *
 * Features:
 * - Animated pulsing bubble effect
 * - Only visible when agent is speaking
 * - Smooth fade in/out transitions
 * - Can be positioned anywhere in the layout
 *
 * Usage:
 * <VapiSpeakingIndicator />
 */
export default function VapiSpeakingIndicator() {
  const { isSpeaking, isCallActive } = useVapi();

  // Don't show if call is not active
  if (!isCallActive) return null;

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-300 ease-in-out
        ${isSpeaking ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
      `}
    >
      <div className="relative flex items-center gap-3 px-5 py-3 bg-white border-2 border-black rounded-full shadow-lg">
        {/* Animated pulse rings */}
        <div className="relative w-3 h-3">
          <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-75"></div>
          <div className="relative w-3 h-3 bg-black rounded-full"></div>
        </div>

        {/* Text label */}
        <span className="text-black font-medium text-sm">
          AI is speaking...
        </span>

        {/* Animated sound wave bars */}
        <div className="flex items-center gap-1">
          <div
            className="w-1 h-3 bg-black rounded-full animate-sound-wave"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1 h-4 bg-black rounded-full animate-sound-wave"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1 h-5 bg-black rounded-full animate-sound-wave"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-1 h-4 bg-black rounded-full animate-sound-wave"
            style={{ animationDelay: "450ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
