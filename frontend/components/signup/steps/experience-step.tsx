"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExperienceLevel {
  value: string;
  label: string;
  desc: string;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { value: "beginner", label: "Beginner", desc: "Learning the basics" },
  { value: "intermediate", label: "Intermediate", desc: "1-3 years" },
  { value: "advanced", label: "Advanced", desc: "3-5 years" },
  { value: "expert", label: "Expert", desc: "5+ years" },
];

interface ExperienceStepProps {
  experience: string;
  onExperienceChange: (experience: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function ExperienceStep({
  experience,
  onExperienceChange,
  onNext,
  canProceed,
}: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Experience level</h1>
        <p className="text-sm text-muted-foreground">
          We&#39;ll match the difficulty
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onExperienceChange(level.value)}
              className={cn(
                "py-3.5 px-4 rounded-md border text-left transition-colors",
                experience === level.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-muted",
              )}
            >
              <div className="text-sm font-medium leading-none">
                {level.label}
              </div>
              <div className="text-xs mt-1 opacity-70">{level.desc}</div>
            </button>
          ))}
        </div>

        <Button onClick={onNext} disabled={!canProceed} className="w-full h-11">
          Continue
        </Button>
      </div>
    </div>
  );
}
