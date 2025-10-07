"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";

export function BillingSection() {
  const router = useRouter();

  return (
    <SettingsSection
      id="billing"
      title="Billing"
      description="Manage your subscription"
    >
      <div className="rounded-lg border p-6 bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="font-medium">Free Plan</p>
            <p className="text-sm text-muted-foreground">
              3 practice sessions per week
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/pricing")}
            className="w-full sm:w-auto"
          >
            Upgrade
          </Button>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span>Basic AI interviewer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span>Session transcripts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
            <span className="text-muted-foreground">Advanced feedback</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
            <span className="text-muted-foreground">Unlimited sessions</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Need to cancel or change your plan?</p>
        <button className="underline underline-offset-4 hover:text-foreground transition-colors">
          Contact support
        </button>
      </div>
    </SettingsSection>
  );
}
