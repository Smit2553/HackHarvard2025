"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "student", label: "Student" },
  { value: "employed", label: "Employed" },
  { value: "seeking", label: "Job seeking" },
  { value: "switching", label: "Switching" },
];

interface StatusStepProps {
  status: string;
  onStatusChange: (status: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function StatusStep({
  status,
  onStatusChange,
  onNext,
  canProceed,
}: StatusStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Current status</h1>
        <p className="text-sm text-muted-foreground">
          Help us personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={cn(
                "py-4 px-4 rounded-md border text-sm font-medium transition-colors",
                status === option.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-muted",
              )}
            >
              {option.label}
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
