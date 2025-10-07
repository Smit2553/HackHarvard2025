"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";

type PlanType = "free" | "pro" | "team";

export function BillingSection() {
  const router = useRouter();

  // TODO: Replace with actual user plan from auth/database
  const currentPlan: PlanType = "pro"; // Change to "pro" or "team" to test

  const planConfig = {
    free: {
      name: "Free Plan",
      description: "3 practice sessions per week",
      features: [
        { text: "Basic AI interviewer", available: true },
        { text: "Session transcripts", available: true },
        { text: "Advanced feedback", available: false },
        { text: "Unlimited sessions", available: false },
      ],
      action: {
        label: "Upgrade to Pro",
        variant: "default" as const,
        onClick: () => router.push("/pricing"),
      },
      footer: {
        text: "Want unlimited practice and advanced features?",
        link: "View pricing plans",
        onClick: () => router.push("/pricing"),
      },
    },
    pro: {
      name: "Pro Plan",
      description: "$19/month • Next billing on Jan 15, 2025",
      features: [
        { text: "Unlimited interviews", available: true },
        { text: "All 500+ problems", available: true },
        { text: "AI feedback on communication", available: true },
        { text: "Download transcripts", available: true },
        { text: "Priority support", available: true },
      ],
      action: {
        label: "Cancel Subscription",
        variant: "outline" as const,
        onClick: () => {
          // TODO: Implement cancellation flow with confirmation dialog
          if (
            confirm("Are you sure you want to cancel your Pro subscription?")
          ) {
            console.log("Cancel subscription");
          }
        },
      },
      footer: {
        text: "Your subscription will renew automatically.",
        link: "Update payment method",
        onClick: () => {
          // TODO: Navigate to payment method update
          console.log("Update payment method");
        },
      },
    },
    team: {
      name: "Team Plan",
      description: "5 seats • $245/month",
      features: [
        { text: "Everything in Pro", available: true },
        { text: "Team dashboard", available: true },
        { text: "Progress tracking", available: true },
        { text: "Custom problem sets", available: true },
        { text: "Dedicated support", available: true },
      ],
      action: {
        label: "Manage Team",
        variant: "outline" as const,
        onClick: () => {
          // TODO: Navigate to team management page
          router.push("/team/manage");
        },
      },
      footer: {
        text: "Questions about billing or team management?",
        link: "Contact your account manager",
        onClick: () => {
          // TODO: Add support contact
          window.location.href = "mailto:support@offscript.com";
        },
      },
    },
  };

  const config = planConfig[currentPlan];

  return (
    <SettingsSection
      id="billing"
      title="Billing"
      description="Manage your subscription"
    >
      <div className="rounded-lg border p-6 bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="font-medium">{config.name}</p>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
          <Button
            variant={config.action.variant}
            size="sm"
            onClick={config.action.onClick}
            className={`w-full sm:w-auto ${
              config.action.variant === "outline" && currentPlan === "pro"
                ? "text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                : ""
            }`}
          >
            {config.action.label}
          </Button>
        </div>
        <div className="space-y-2.5 text-sm">
          {config.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  feature.available ? "bg-green-500" : "bg-muted-foreground/50"
                }`}
              />
              <span
                className={feature.available ? "" : "text-muted-foreground"}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {currentPlan === "pro" && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <p>Your subscription will renew automatically on Jan 15, 2025.</p>
            <button
              onClick={config.footer.onClick}
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Update payment method
            </button>
          </div>

          <div className="text-xs text-muted-foreground pt-3 border-t border-border/50">
            If you cancel, you&#39;ll retain Pro access until your billing
            period ends.
          </div>
        </div>
      )}

      {currentPlan !== "pro" && (
        <div className="text-sm text-muted-foreground">
          <p>{config.footer.text}</p>
          <button
            onClick={config.footer.onClick}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {config.footer.link}
          </button>
        </div>
      )}
    </SettingsSection>
  );
}
