"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import Vapi from "@vapi-ai/web";

interface TranscriptSegment {
  type: "transcript" | "call-start" | "call-end";
  role?: "user" | "assistant";
  text?: string;
  timestamp: string;
  secondsSinceStart: number;
}

interface VapiMessage {
  type: string;
  transcriptType?: string;
  role?: string;
  transcript?: string;
}

interface VapiContextType {
  vapi: Vapi | null;
  isCallActive: boolean;
  isSpeaking: boolean;
  startCall: () => Promise<void>;
  endCall: () => void;
  sendCodeContext: (code: string, language: string, problem: string) => void;
  error: string | null;
  transcript: TranscriptSegment[];
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

export function VapiProvider({ children }: { children: ReactNode }) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const callStartTimeRef = useRef<number | null>(null);

  // Initialize Vapi instance on mount
  useEffect(() => {
    const vapiInstance = new Vapi(
      process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "",
    );
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on("call-start", () => {
      console.log("Call started");
      const now = Date.now();
      callStartTimeRef.current = now;
      setIsCallActive(true);
      setError(null);
      setTranscript([
        {
          type: "call-start",
          timestamp: new Date(now).toISOString(),
          secondsSinceStart: 0,
        },
      ]);
    });

    vapiInstance.on("call-end", () => {
      console.log("Call ended");
      const now = Date.now();
      const secondsSinceStart = callStartTimeRef.current
        ? (now - callStartTimeRef.current) / 1000
        : 0;
      setTranscript((prev) => {
        const finalTranscript: TranscriptSegment[] = [
          ...prev,
          {
            type: "call-end" as const,
            timestamp: new Date(now).toISOString(),
            secondsSinceStart,
          },
        ];
        // Print the complete transcript to console
        console.log(
          "📝 Call Transcript:",
          JSON.stringify(finalTranscript, null, 2),
        );
        return finalTranscript;
      });
      setIsCallActive(false);
      callStartTimeRef.current = null;
    });

    vapiInstance.on("error", (err) => {
      console.error("Vapi error:", err);
      setError(err.message || "An error occurred");
      setIsCallActive(false);
    });

    vapiInstance.on("speech-start", () => {
      console.log("Agent started speaking");
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      console.log("Agent stopped speaking");
      setIsSpeaking(false);
    });

    // Listen for message events to capture transcript
    vapiInstance.on("message", (message: VapiMessage) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const now = Date.now();
        const secondsSinceStart = callStartTimeRef.current
          ? (now - callStartTimeRef.current) / 1000
          : 0;

        const segment: TranscriptSegment = {
          type: "transcript",
          role: message.role === "user" ? "user" : "assistant",
          text: message.transcript,
          timestamp: new Date(now).toISOString(),
          secondsSinceStart,
        };

        setTranscript((prev) => [...prev, segment]);
      }
    });

    // Cleanup on unmount
    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapi) {
      setError("Vapi is not initialized");
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setError("Assistant ID not configured");
      return;
    }

    try {
      setError(null);
      await vapi.start(assistantId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start call";
      setError(errorMessage);
      console.error("Failed to start call:", err);
    }
  }, [vapi]);

  const endCall = useCallback(() => {
    if (!vapi) return;

    try {
      vapi.stop();
      setIsCallActive(false);
    } catch (err) {
      console.error("Failed to end call:", err);
    }
  }, [vapi]);

  /**
   * Send code context using Vapi metadata (invisible to conversation)
   * Metadata is accessible to AI but doesn't appear in chat transcript
   */
  const sendCodeContext = useCallback((code: string, language: string, problem: string) => {
    if (!vapi || !isCallActive) {
      console.log('⚠️  Cannot send code: Call not active');
      return;
    }

    try {
      console.log('📤 Sending code context via metadata');
      console.log(`   Problem: ${problem}`);
      console.log(`   Language: ${language}`);
      console.log(`   Code length: ${code.length} chars`);

      // Use metadata approach - keeps code completely separate from conversation
      // TypeScript doesn't recognize metadata field, so we cast to any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (vapi as any).send({
        type: "add-message",
        message: {
          role: "system",
          content: "Code context updated"
        },
        metadata: {
          type: "code_update",
          problem: problem,
          language: language,
          code: code,
          lines: code.split('\n').length,
          timestamp: new Date().toISOString()
        }
      });

      console.log('✅ Code context sent via metadata');
    } catch (error) {
      console.error('❌ Failed to send code context:', error);
    }
  }, [vapi, isCallActive]);

  return (
    <VapiContext.Provider
      value={{
        vapi,
        isCallActive,
        isSpeaking,
        startCall,
        endCall,
        sendCodeContext,
        error,
        transcript,
      }}
    >
      {children}
    </VapiContext.Provider>
  );
}

export function useVapi() {
  const context = useContext(VapiContext);
  if (context === undefined) {
    throw new Error("useVapi must be used within a VapiProvider");
  }
  return context;
}
