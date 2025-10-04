interface InfoPanelProps {
  title?: string;
  previewImage?: string;
  userStories?: string[];
}

/**
 * InfoPanel component - displays project info in the left column
 *
 * This component shows:
 * - Project title
 * - Screenshot/preview (placeholder for now)
 * - User stories list
 *
 * To customize:
 * - Replace previewImage with actual screenshot URL
 * - Update userStories array with real project requirements
 * - Add additional sections (e.g., tech stack, team info)
 * - Style further with Tailwind utilities as needed
 */
export default function InfoPanel({
  title = "Project Dashboard",
  previewImage = "/placeholder-screenshot.png",
}: InfoPanelProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <div className="h-1 w-20 bg-blue-600 rounded"></div>
      </div>

      {/* Preview/Screenshot Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Preview
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {/* Placeholder for screenshot - replace with actual image */}
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Screenshot placeholder
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Replace with actual project screenshot
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Problem
        </h2>
      </div>

      {/* Footer note */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          💡 Tip: This panel is fixed width on larger screens
        </p>
      </div>
    </div>
  );
}
