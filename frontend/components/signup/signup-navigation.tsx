"use client";

import { ChevronLeft } from "lucide-react";

interface SignupNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  onBack: () => void;
}

export function SignupNavigation({
  currentStepIndex,
  totalSteps,
  onBack,
}: SignupNavigationProps) {
  if (currentStepIndex === 0) return null;

  return (
    <>
      <button
        onClick={onBack}
        className="absolute top-6 left-4 md:left-6 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-3 h-3" />
        Back
      </button>

      {currentStepIndex < totalSteps - 1 && (
        <span className="absolute top-6 right-4 md:right-6 text-xs text-muted-foreground">
          {currentStepIndex} of {totalSteps - 1}
        </span>
      )}
    </>
  );
}
