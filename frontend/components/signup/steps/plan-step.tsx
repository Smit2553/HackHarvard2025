"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PlanStepProps {
  plan: "free" | "pro";
  status: string;
  onPlanChange: (plan: "free" | "pro") => void;
  onSubmit: () => void;
}

export function PlanStep({
  plan,
  status,
  onPlanChange,
  onSubmit,
}: PlanStepProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">You can upgrade anytime</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onPlanChange("free")}
          className={cn(
            "w-full p-4 rounded-lg border text-left transition-all",
            plan === "free"
              ? "border-foreground"
              : "border-border hover:border-border/80",
          )}
        >
          <div className="space-y-1">
            <div className="font-medium">Free</div>
            <div className="text-sm text-muted-foreground">
              3 interviews/week • Basic features
            </div>
          </div>
        </button>

        <button
          onClick={() => onPlanChange("pro")}
          className={cn(
            "w-full p-4 rounded-lg border text-left transition-all relative",
            plan === "pro"
              ? "border-foreground"
              : "border-border hover:border-border/80",
          )}
        >
          <div className="absolute -top-2.5 right-4">
            <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded-full">
              {status === "seeking" ? "Best for you" : "Recommended"}
            </span>
          </div>
          <div className="space-y-1">
            <div className="font-medium flex items-baseline gap-2">
              Pro
              <span className="text-sm font-normal text-muted-foreground">
                $19/month
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Unlimited • AI feedback • All features
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              7-day free trial
            </div>
          </div>
        </button>
      </div>

      <div className="space-y-3">
        <Button onClick={onSubmit} className="w-full h-11">
          {plan === "free" ? "Start practicing" : "Start free trial"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Looking for team plans?{" "}
          <button
            onClick={() => router.push("/pricing")}
            className="cursor-pointer underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Contact us
          </button>
        </p>
      </div>
    </div>
  );
}
