"use client";

import { useRouter } from "next/navigation";
import { useVapi } from "@/components/VapiProvider";
import { useState } from "react";

/**
 * Interview Landing Page
 *
 * This page serves as the entry point for mock interviews.
 * Users click "Start Interview" which:
 * 1. Initiates a Vapi call with the configured assistant
 * 2. Routes to the editor page where the interview happens
 *
 * The Vapi assistant will be able to hear the user and respond via voice.
 */
export default function InterviewLanding() {
  const router = useRouter();
  const { startCall, error } = useVapi();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async () => {
    setIsStarting(true);

    try {
      // Route to the editor page immediately for instant feedback
      router.push("/interview");

      // Start the Vapi call (will connect in background)
      await startCall();
    } catch (err) {
      console.error("Failed to start interview:", err);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="max-w-2xl w-full mx-auto px-6">
        <div className="bg-neutral-900 rounded-2xl shadow-xl p-12 text-center border border-neutral-800">
          {/* Header */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Mock Interview Practice
          </h1>
          <p className="text-lg text-neutral-300 mb-8">
            Practice coding interviews with an AI interviewer that provides
            real-time feedback
          </p>

          {/* Features List */}
          <div className="mb-10 space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-white flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-neutral-300">
                Voice-enabled AI interviewer
              </span>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-white flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-neutral-300">
                Full-featured code editor
              </span>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-white flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-neutral-300">
                Real-time feedback on your code
              </span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartInterview}
            disabled={isStarting}
            className="w-full max-w-sm mx-auto bg-white hover:bg-neutral-200 disabled:bg-neutral-600 disabled:cursor-not-allowed text-black font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            {isStarting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Start Interview</span>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
              <p className="text-neutral-300 text-sm">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <p className="mt-8 text-sm text-neutral-500">
            Make sure your microphone is enabled. The interview will start
            immediately after clicking.
          </p>
        </div>
      </div>
    </div>
  );
}
