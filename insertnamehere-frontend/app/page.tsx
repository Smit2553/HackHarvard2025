import InfoPanel from '@/components/InfoPanel';
import Editor from '@/components/Editor';

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
  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column - Info Panel (fixed width on desktop) */}
      <aside className="w-full lg:w-96 lg:flex-shrink-0 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
        <InfoPanel
          title="Code Editor Dashboard"
          userStories={[
            'As a developer, I want to write and edit code with syntax highlighting',
            'As a user, I want to see the project requirements and context',
            'As a team member, I want to understand the feature specifications',
            'As a collaborator, I want a clean interface to focus on coding',
          ]}
        />
      </aside>

      {/* Right Column - Editor Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Code Editor
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              JavaScript
            </span>
            {/* Add buttons here for save, run, etc. when needed */}
          </div>
        </header>

        {/* Editor Container - fills remaining space */}
        <div className="flex-1 overflow-hidden">
          <Editor
            defaultLanguage="javascript"
            defaultValue={`// Welcome to the Monaco Code Editor!
// This is a fully-featured code editor powered by the same engine as VS Code.

function greet(name) {
  return \`Hello, \${name}! Welcome to your code editor.\`;
}

// Try editing this code - you'll get syntax highlighting,
// IntelliSense, and all the features you'd expect!
const message = greet("Developer");
console.log(message);

// TODO: Connect this editor to your backend
// TODO: Add save functionality
// TODO: Add terminal output below
`}
          />
        </div>
      </main>
    </div>
  );
}
