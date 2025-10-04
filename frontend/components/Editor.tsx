"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

export default function Editor({
  defaultValue = "",
  language = "python",
  onChange,
}: {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
}) {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      defaultValue={defaultValue}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineHeight: 20,
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        renderLineHighlight: "none",
        fontFamily: "SF Mono, Monaco, Consolas, monospace",
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
      }}
      theme="vs-light"
      onMount={(editor, monaco) => {
        monaco.editor.defineTheme("offscript-light", {
          base: "vs",
          inherit: true,
          rules: [
            { token: "comment", foreground: "6B7280" },
            { token: "keyword", foreground: "8B5CF6" },
            { token: "string", foreground: "059669" },
          ],
          colors: {
            "editor.background": "#FFFFFF",
            "editor.lineHighlightBackground": "#00000000",
            "editorLineNumber.foreground": "#9CA3AF",
          },
        });

        monaco.editor.defineTheme("offscript-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "6B7280" },
            { token: "keyword", foreground: "A78BFA" },
            { token: "string", foreground: "34D399" },
          ],
          colors: {
            "editor.background": "#0A0A0A",
            "editor.lineHighlightBackground": "#00000000",
            "editorLineNumber.foreground": "#4B5563",
          },
        });

        const updateTheme = () => {
          const isDark = document.documentElement.classList.contains("dark");
          monaco.editor.setTheme(isDark ? "offscript-dark" : "offscript-light");
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }}
    />
  );
}
