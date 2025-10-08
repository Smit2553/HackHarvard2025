export interface Transcript {
  id: number;
  call_duration: number;
  user_messages: number;
  assistant_messages: number;
  created_at: string;
  transcript?: TranscriptSegment[];
  metadata?: Record<string, unknown>;
}

export interface TranscriptSegment {
  type: "transcript" | "call-start" | "call-end";
  role?: "user" | "assistant";
  text?: string;
  timestamp: string;
  secondsSinceStart: number;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  acceptance: number;
  frequency: number;
  topics: string[];
  companies: string[];
}

export interface Company {
  id: string;
  name: string;
  problems: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  topics: string[];
  description: string;
  avgTime: string;
  trending: boolean;
}

export interface PopularItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface ProgressData {
  sessionsCompleted: number;
  problemsSolved: number;
  practiceTime: string;
}
