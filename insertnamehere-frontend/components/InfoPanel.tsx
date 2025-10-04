"use client";

interface InfoPanelProps {
  title?: string;
  type?: string;
  description?: string;
  exampleTestCase?: {
    input: string;
    output: string;
    explanation: string;
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * InfoPanel component - displays project info in the left column
 *
 * This component shows:
 * - Problem title and type
 * - Problem description
 * - Example test case with input/output in code blocks
 *
 * To customize:
 * - Style further with Tailwind utilities as needed
 */
export default function InfoPanel({
  title = "Project Dashboard",
  type = "",
  description = "",
  exampleTestCase,
  isCollapsed = false,
  onToggleCollapse,
}: InfoPanelProps) {
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
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span
            className="text-xs writing-mode-vertical transform -rotate-180"
            style={{ writingMode: "vertical-rl" }}
          >
            Problem
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black p-6 overflow-y-auto">
      {/* Title Section */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          {type && (
            <div className="inline-block px-3 py-1 bg-neutral-800 text-neutral-200 text-sm font-medium rounded-full border border-neutral-700">
              {type}
            </div>
          )}
          <div className="h-1 w-20 bg-white rounded mt-3"></div>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-neutral-400 hover:text-white transition-colors p-1 ml-2"
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
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Description Section */}
      {!isCollapsed && description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-200 mb-3">
            Description
          </h2>
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <p className="text-neutral-300 leading-relaxed">{description}</p>
          </div>
        </div>
      )}

      {/* Example Test Case Section */}
      {!isCollapsed && exampleTestCase && (
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-neutral-200 mb-3">
            Example
          </h2>
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4">
            {/* Input */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-2">
                Input:
              </h3>
              <pre className="bg-black rounded p-3 overflow-x-auto text-sm border border-neutral-800">
                <code className="text-neutral-200 font-mono">
                  {exampleTestCase.input}
                </code>
              </pre>
            </div>

            {/* Output */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-2">
                Output:
              </h3>
              <pre className="bg-black rounded p-3 overflow-x-auto text-sm border border-neutral-800">
                <code className="text-neutral-200 font-mono">
                  {exampleTestCase.output}
                </code>
              </pre>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-2">
                Explanation:
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {exampleTestCase.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      {!isCollapsed && (
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 text-center">
            💡 Tip: This panel is fixed width on larger screens
          </p>
        </div>
      )}
    </div>
  );
}
