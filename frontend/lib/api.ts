import type { Transcript } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://harvardapi.codestacx.com";

async function getJSON<Resp>(path: string): Promise<Resp> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<Resp>;
}

export interface TranscriptImprovements {
  points: string[];
}

export interface ScrapeLeetcodeResponse {
  problem_id: string;
}

export const api = {
  // Transcripts
  transcripts: (): Promise<Transcript[]> =>
    getJSON<Transcript[]>("/api/transcripts"),
  transcript: (id: string | number): Promise<Transcript> =>
    getJSON<Transcript>(`/api/transcript/${id}`),
  latestTranscript: (): Promise<Transcript> =>
    getJSON<Transcript>("/api/transcript/latest"),
  transcriptImprovements: (
    id: string | number,
  ): Promise<TranscriptImprovements> =>
    getJSON<TranscriptImprovements>(`/api/transcript/${id}/improvements`),

  // Problems
  // Use explicit type parameters in the call site (no default any here)
  leetcodeRandom: <T>(): Promise<T> => getJSON<T>("/api/leetcode"),
  problemById: <T>(problemId: string): Promise<T> =>
    getJSON<T>(`/api/problem/${problemId}`),

  // Scrape
  scrapeLeetcode: async (url: string): Promise<ScrapeLeetcodeResponse> => {
    const res = await fetch(`${API_URL}/api/scrape_leetcode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}) as { detail?: string });
      throw new Error(err.detail || "Failed to scrape problem");
    }
    return res.json() as Promise<ScrapeLeetcodeResponse>;
  },
};
