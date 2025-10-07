"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AboutStepProps {
  fullName: string;
  onFullNameChange: (name: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function AboutStep({
  fullName,
  onFullNameChange,
  onNext,
  canProceed,
}: AboutStepProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">What's your name?</h1>
        <p className="text-sm text-muted-foreground">
          We'll use this in your sessions
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="h-11 text-center"
          autoFocus
        />

        <Button onClick={onNext} disabled={!canProceed} className="w-full h-11">
          Continue
        </Button>
      </div>
    </div>
  );
}
