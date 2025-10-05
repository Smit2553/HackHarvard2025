"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InfoPanel from "@/components/InfoPanel";
import Editor from "@/components/Editor";
import TranscriptPanel from "@/components/TranscriptPanel";
import { Button } from "@/components/ui/button";
import { useVapi } from "@/components/VapiProvider";
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
  const {
    startCall,
    endCall,
    isCallActive,
    transcript,
    error: vapiError,
  } = useVapi();
  const [problemData, setProblemData] = useState<LeetCodeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeInSeconds, setTimeInSeconds] = useState(15 * 60);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("python");
  const { resolvedTheme, setTheme } = useTheme();
  const callInitializedRef = useRef(false);

  // Convert Vapi transcript to TranscriptPanel format
  const transcriptMessages = transcript
    .filter((segment) => segment.type === "transcript" && segment.text)
    .map((segment) => ({
      speaker:
        segment.role === "assistant"
          ? ("interviewer" as const)
          : ("user" as const),
      timestamp: new Date(segment.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: segment.text || "",
    }));

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

  // Start Vapi call when component mounts with metadata (only once)
  useEffect(() => {
    const initCall = async () => {
      // Only initialize the call once, even if dependencies change
      if (callInitializedRef.current) return;
      if (!problemData) return; // Wait for problem data to load

      try {
        callInitializedRef.current = true; // Mark as initialized
        await startCall({
          problemTitle: problemData?.title,
          problemType: problemData?.type,
          language: language,
        });
      } catch (err) {
        console.error("Failed to start interview call:", err);
        callInitializedRef.current = false; // Reset on error so it can retry
      }
    };
    initCall();

    // Cleanup: end call when component unmounts
    return () => {
      if (isCallActive) {
        endCall();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemData]); // Only depend on problemData to avoid restarting call

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

  const handleEndInterview = async () => {
    // End the call (VapiProvider will handle transcript upload automatically)
    if (isCallActive) {
      await endCall();
    }
    router.push("/score");
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
                onClick={handleEndInterview}
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
              <TranscriptPanel messages={transcriptMessages} />
              {vapiError && (
                <div className="px-6 py-2 text-xs text-red-500 border-t border-border/50">
                  {vapiError}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
