interface InfoPanelProps {
  title?: string;
  type?: string;
  description?: string;
  exampleTestCase?: {
    input: string;
    output: string;
    explanation: string;
  };
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
}: InfoPanelProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        {type && (
          <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
            {type}
          </div>
        )}
        <div className="h-1 w-20 bg-blue-600 rounded mt-3"></div>
      </div>

      {/* Description Section */}
      {description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Description
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}

      {/* Example Test Case Section */}
      {exampleTestCase && (
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Example
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* Input */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Input:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-3 overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200 font-mono">
                  {exampleTestCase.input}
                </code>
              </pre>
            </div>

            {/* Output */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Output:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-3 overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200 font-mono">
                  {exampleTestCase.output}
                </code>
              </pre>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Explanation:
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {exampleTestCase.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          💡 Tip: This panel is fixed width on larger screens
        </p>
      </div>
    </div>
  );
}
