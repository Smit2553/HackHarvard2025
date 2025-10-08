"use client";

import { ReactNode } from "react";
import {
  TrendingUp,
  Clock,
  Target,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ProgressData, PopularItem } from "@/types/practice";

interface SidebarSection {
  title: string;
  content: ReactNode;
  variant?: "default" | "muted";
}

interface PracticeSidebarProps {
  sections: SidebarSection[];
  showProgress?: boolean;
  progressData?: ProgressData;
  showPopular?: boolean;
  popularItems?: PopularItem[];
  onPopularClick?: (id: string) => void;
}

export function PracticeSidebar({
  sections,
  showProgress = true,
  progressData,
  showPopular = true,
  popularItems = [],
  onPopularClick,
}: PracticeSidebarProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg ${
            section.variant === "muted"
              ? "bg-muted/30"
              : "border border-border/50"
          } space-y-4`}
        >
          <h3 className="font-medium">{section.title}</h3>
          {section.content}
        </div>
      ))}

      {showProgress && progressData && (
        <div className="p-6 rounded-lg border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Your progress</h3>
            <button
              onClick={() => router.push("/progress")}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Sessions completed
              </span>
              <span className="text-sm font-medium">
                {progressData.sessionsCompleted}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Problems solved
              </span>
              <span className="text-sm font-medium">
                {progressData.problemsSolved}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Practice time
              </span>
              <span className="text-sm font-medium">
                {progressData.practiceTime}
              </span>
            </div>
          </div>
        </div>
      )}

      {showPopular && popularItems.length > 0 && (
        <div className="p-6 rounded-lg border border-border/50 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <h3 className="font-medium">Most popular</h3>
          </div>
          <div className="space-y-2">
            {popularItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPopularClick?.(item.id)}
                className="w-full group"
              >
                <div className="cursor-pointer flex justify-between items-center py-2 px-3 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
