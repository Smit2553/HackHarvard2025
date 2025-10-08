"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Transcript } from "@/lib/types";

export function useTranscripts() {
  const [data, setData] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.transcripts();
      setData(Array.isArray(res) ? res : []);
    } catch {
      setError("Failed to load transcripts");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const stats = useMemo(() => {
    const totalPracticeTime = data.reduce(
      (sum, t) => sum + (t.call_duration || 0),
      0,
    );
    const avgSessionLength = data.length
      ? Math.round(totalPracticeTime / data.length)
      : 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekSessions = data.filter(
      (t) => new Date(t.created_at) > weekAgo,
    ).length;

    let currentStreak = 0;
    if (data.length) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      let cursor = new Date(today);
      for (const t of sorted) {
        const d = new Date(t.created_at);
        d.setHours(0, 0, 0, 0);
        const diffDays = Math.floor(
          (cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays === 0 || diffDays === 1) {
          currentStreak += 1;
          cursor = new Date(d);
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      totalPracticeTime,
      avgSessionLength,
      thisWeekSessions,
      currentStreak,
    };
  }, [data]);

  return { data, loading, error, refetch, stats };
}
