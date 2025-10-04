'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import of Monaco Editor to avoid SSR issues
// Monaco Editor requires browser APIs that are not available during server-side rendering
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-900 text-white">
      <div className="text-center">
        <div className="mb-2">Loading Editor...</div>
        <div className="text-sm text-gray-400">Monaco Editor is initializing</div>
      </div>
    </div>
  ),
});

interface EditorProps {
  defaultValue?: string;
  defaultLanguage?: string;
  theme?: string;
  onChange?: (value: string | undefined) => void;
}

/**
 * Client-side Monaco Editor component
 * 
 * This component wraps the Monaco Editor and ensures it only loads on the client side.
 * 
 * Usage:
 * ```tsx
 * <Editor 
 *   defaultValue="// Start coding here"
 *   defaultLanguage="javascript"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 * 
 * To extend functionality:
 * - Add save functionality by capturing onChange events
 * - Implement additional editor options via props
 * - Add language switching controls
 * - Integrate with terminal or execution environment
 */
export default function Editor({
  defaultValue = '// Start coding here\nfunction hello() {\n  console.log("Hello, World!");\n}\n',
  defaultLanguage = 'javascript',
  theme = 'vs-dark',
  onChange,
}: EditorProps) {
  const [isError, setIsError] = useState(false);

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        defaultLanguage={defaultLanguage}
        defaultValue={defaultValue}
        theme={theme}
        onChange={onChange}
        onMount={(editor, monaco) => {
          console.log('Monaco Editor mounted successfully');
        }}
        beforeMount={(monaco) => {
          console.log('Monaco Editor preparing to mount');
        }}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true, // Auto-resize on container size changes
          padding: { top: 16, bottom: 16 },
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
