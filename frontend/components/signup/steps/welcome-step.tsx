"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface WelcomeStepProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function WelcomeStep({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onNext,
  canProceed,
}: WelcomeStepProps) {
  const router = useRouter();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join thousands practicing interviews
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="h-11"
          autoFocus
        />

        <Input
          type="password"
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="h-11"
        />

        <Button onClick={onNext} disabled={!canProceed} className="w-full h-11">
          Continue
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
