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
  startCall: (metadata?: Record<string, unknown>) => Promise<void>;
  endCall: () => Promise<void>;
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
  const callMetadataRef = useRef<Record<string, unknown> | undefined>(
    undefined,
  );

  // Function to upload transcript to backend
  const uploadTranscript = async (
    transcriptData: TranscriptSegment[],
    metadata?: Record<string, unknown>,
  ) => {
    try {
      console.log("Uploading transcript to backend...");
      const response = await fetch(
        "https://harvardapi.codestacx.com/api/transcript",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: transcriptData,
            metadata: metadata || {},
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to upload transcript: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Transcript uploaded successfully:", result);
      return result;
    } catch (err) {
      console.error("❌ Error uploading transcript:", err);
      throw err;
    }
  };

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

        // Upload transcript to backend with duration in metadata
        const metadataWithDuration = {
          ...callMetadataRef.current,
          duration: secondsSinceStart,
        };
        uploadTranscript(finalTranscript, metadataWithDuration);

        return finalTranscript;
      });
      setIsCallActive(false);
      callStartTimeRef.current = null;
      callMetadataRef.current = undefined;
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

  const startCall = useCallback(
    async (metadata?: Record<string, unknown>) => {
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
        // Store metadata for later use when uploading transcript
        callMetadataRef.current = metadata;
        await vapi.start(assistantId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start call";
        setError(errorMessage);
        console.error("Failed to start call:", err);
      }
    },
    [vapi],
  );

  const endCall = useCallback(async () => {
    if (!vapi) return;

    try {
      vapi.stop();
      setIsCallActive(false);

      // Wait a moment for the call-end event to process and transcript to finalize
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error("Failed to end call:", err);
    }
  }, [vapi]);

  return (
    <VapiContext.Provider
      value={{
        vapi,
        isCallActive,
        isSpeaking,
        startCall,
        endCall,
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
