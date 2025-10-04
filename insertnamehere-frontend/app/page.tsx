"use client";

import { useEffect, useState } from "react";
import InfoPanel from "@/components/InfoPanel";
import Editor from "@/components/Editor";

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
 * Home page - Two-column layout with InfoPanel and Monaco Editor
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
export default function Home() {
  const [problemData, setProblemData] = useState<LeetCodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column - Info Panel (fixed width on desktop) */}
      <aside className="w-full lg:w-96 lg:flex-shrink-0 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-lg text-gray-600 dark:text-gray-400">
                Loading problem...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-lg text-red-600 dark:text-red-400">
                Error: {error}
              </div>
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

      {/* Right Column - Editor Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {problemData?.title || "Interview Practice Dashboard"}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Python
            </span>
            {/* Add buttons here for save, run, etc. when needed */}
          </div>
        </header>

        {/* Editor Container - fills remaining space */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-gray-900 text-white">
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
    </div>
  );
}
