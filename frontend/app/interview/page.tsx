"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InfoPanel from "@/components/InfoPanel";
import Editor from "@/components/Editor";
import TranscriptPanel from "@/components/TranscriptPanel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

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

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
];

export default function InterviewPage() {
  const router = useRouter();
  const [problemData, setProblemData] = useState<LeetCodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeInSeconds, setTimeInSeconds] = useState(15 * 60);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("python");
  const { resolvedTheme, setTheme } = useTheme();

  const tempTranscriptMessages = [
    {
      speaker: "interviewer" as const,
      timestamp: "00:32",
      text: "Can you walk me through your approach to this problem?",
    },
    {
      speaker: "user" as const,
      timestamp: "00:45",
      text: "I'm thinking we can use a hash map to store values we've seen, then check if the complement exists...",
    },
    {
      speaker: "interviewer" as const,
      timestamp: "01:12",
      text: "Good. What would be the time complexity of that approach?",
    },
    {
      speaker: "user" as const,
      timestamp: "01:28",
      text: "It would be O(n) since we only need to iterate through the array once.",
    },
    {
      speaker: "interviewer" as const,
      timestamp: "01:45",
      text: "That's correct. Can you implement this solution?",
    },
    {
      speaker: "user" as const,
      timestamp: "02:03",
      text: "Sure, let me start by creating a hash map to store the values and their indices...",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${isNegative ? "+" : ""}${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <div className="flex w-full">
        <div
          className={`${leftCollapsed ? "w-12" : "w-[420px]"} transition-all duration-300 border-r border-border/50 flex flex-col bg-muted/5 flex-shrink-0`}
        >
          {leftCollapsed ? (
            <button
              onClick={() => setLeftCollapsed(false)}
              className="h-full w-full flex items-center justify-center hover:bg-muted/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <div className="h-14 flex items-center justify-between px-6 border-b border-border/50">
                <h2 className="text-sm font-medium">Problem</h2>
                <button
                  onClick={() => setLeftCollapsed(true)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <InfoPanel
                title={problemData?.title}
                type={problemData?.type}
                description={problemData?.description}
                exampleTestCase={problemData?.example_test_case}
                loading={loading}
                error={error}
              />
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 flex items-center justify-between px-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium">Code</h2>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="relative p-2 hover:bg-muted rounded-md transition-colors"
                  aria-label="Toggle theme"
                >
                  <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 top-2 left-2" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span
                  className={`text-sm font-mono ${
                    timeInSeconds < 0 ? "text-red-500" : "text-foreground"
                  }`}
                >
                  {formatTime(timeInSeconds)}
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowEndDialog(true)}
              >
                End Interview
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading editor...
                </p>
              </div>
            ) : problemData ? (
              <Editor
                language={language}
                defaultValue={problemData.starter_code}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load problem
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${rightCollapsed ? "w-12" : "w-[420px]"} transition-all duration-300 border-l border-border/50 flex flex-col bg-muted/5 flex-shrink-0`}
        >
          {rightCollapsed ? (
            <button
              onClick={() => setRightCollapsed(false)}
              className="h-full w-full flex items-center justify-center hover:bg-muted/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <>
              <div className="h-14 flex items-center justify-between px-6 border-b border-border/50">
                <h2 className="text-sm font-medium">Transcript</h2>
                <button
                  onClick={() => setRightCollapsed(true)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <TranscriptPanel messages={tempTranscriptMessages} />
            </>
          )}
        </div>
      </div>

      {showEndDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 border border-border/50">
            <h3 className="text-lg font-semibold mb-2">End Interview?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to end the interview? Your progress will not
              be saved.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEndDialog(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setShowEndDialog(false);
                  router.push("/practice");
                }}
              >
                End Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
