"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVapi } from "@/components/VapiProvider";
import InfoPanel from "@/components/InfoPanel";
import Editor from "@/components/Editor";
import TranscriptPanel from "@/components/TranscriptPanel";

// TypeScript interface for the LeetCode API response
interface LeetCodeProblem {
  title: string;
  type: string;
  description: string;
  example_test_case: {
    input: string;
    output: string;
    explanation: string;
  };
  expected_solution: string;
  starter_code: string;
  solutions: Array<{
    approach: string;
    code: string;
    time_complexity: string;
    space_complexity: string;
  }>;
}

/**
 * Interview page - Two-column layout with InfoPanel and Monaco Editor
 *
 * Layout structure:
 * - Left column: Fixed-width InfoPanel (responsive: full-width on mobile, fixed on desktop)
 * - Right column: Flexible Editor area with header
 *
 * The layout is responsive:
 * - Mobile/tablet: stacked vertically
 * - Desktop (lg+): side-by-side columns
 *
 * To extend:
 * - Add state management for editor content
 * - Implement save/load functionality
 * - Add terminal component below editor
 * - Connect to backend API for persistence
 */
export default function InterviewPage() {
  const router = useRouter();
  const { endCall } = useVapi();
  const [problemData, setProblemData] = useState<LeetCodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeInSeconds, setTimeInSeconds] = useState(15 * 60); // 15 minutes in seconds
  const [showEndDialog, setShowEndDialog] = useState(false);

  // Temporary transcript data
  const tempTranscriptMessages = [
    {
      speaker: "interviewer" as const,
      timestamp: "00:32",
      text: "Can you explain your approach to solving this problem?",
    },
    {
      speaker: "user" as const,
      timestamp: "00:45",
      text: "I'm thinking of using a hash map to store the values we've seen so far.",
    },
    {
      speaker: "interviewer" as const,
      timestamp: "01:12",
      text: "That sounds like a good approach. What would be the time complexity?",
    },
    {
      speaker: "user" as const,
      timestamp: "01:28",
      text: "It would be O(n) since we only need to iterate through the array once.",
    },
  ];

  useEffect(() => {
    // Fetch problem data from the API
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://harvardapi.codestacx.com/api/leetcode",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }
        const data: LeetCodeProblem = await response.json();
        setProblemData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, []);

  // Timer effect - counts down from 15 minutes, then counts up
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time for display
  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
    return isNegative ? `+${timeStr}` : timeStr;
  };

  // Handle end mock confirmation
  const handleEndMock = () => {
    // Terminate the Vapi call
    endCall();

    // Close the dialog
    setShowEndDialog(false);

    // Route back to start page
    router.push("/start");
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column - Info Panel (fixed width on desktop) */}
      <aside className="w-full lg:w-96 lg:flex-shrink-0 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-neutral-800">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-lg text-neutral-400">Loading problem...</div>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-lg text-white">Error: {error}</div>
            </div>
          </div>
        ) : problemData ? (
          <InfoPanel
            title={problemData.title}
            type={problemData.type}
            description={problemData.description}
            exampleTestCase={problemData.example_test_case}
          />
        ) : null}
      </aside>

      {/* Middle Column - Editor Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-14 bg-neutral-900 border-b border-neutral-800 flex items-center px-6">
          <h2 className="text-lg font-semibold text-white">
            {problemData?.title || "Interview Practice Dashboard"}
          </h2>
          <div className="ml-auto flex items-center gap-4">
            {/* Timer */}
            <div
              className={`text-lg font-mono font-semibold ${
                timeInSeconds < 0 ? "text-white" : "text-white"
              }`}
            >
              {formatTime(timeInSeconds)}
            </div>
            {/* End Mock Button */}
            <button
              onClick={() => setShowEndDialog(true)}
              className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-md text-sm font-medium transition-colors"
            >
              End Mock
            </button>
          </div>
        </header>

        {/* Editor Container - fills remaining space */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-black text-white">
              <div className="text-center">
                <div className="mb-2">Loading Editor...</div>
              </div>
            </div>
          ) : problemData ? (
            <Editor
              defaultLanguage="python"
              defaultValue={problemData.starter_code}
            />
          ) : (
            <Editor
              defaultLanguage="python"
              defaultValue="# Problem failed to load"
            />
          )}
        </div>
      </main>

      {/* Right Column - Transcript Panel (fixed width on desktop) */}
      <aside className="w-full lg:w-96 lg:flex-shrink-0 h-64 lg:h-full border-t lg:border-t-0 lg:border-l border-neutral-800">
        <TranscriptPanel messages={tempTranscriptMessages} />
      </aside>

      {/* End Mock Confirmation Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-neutral-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              End Mock Interview?
            </h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to end the mock interview? Your progress
              will NOT be saved.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEndDialog(false)}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEndMock}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-md text-sm font-medium transition-colors"
              >
                Yes, End Mock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
