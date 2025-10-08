"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Get started with voice practice",
      features: [
        "3 mock interviews per week",
        "Basic problem set",
        "Text transcript only",
        "Community support",
      ],
      cta: "Start Free",
      variant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Everything you need to ace interviews",
      features: [
        "Unlimited mock interviews",
        "All 500+ problems",
        "AI feedback on communication",
        "Download transcripts",
        "Priority support",
      ],
      cta: "Start Pro Trial",
      variant: "default" as const,
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      period: "per seat/month",
      description: "For bootcamps and study groups",
      features: [
        "Everything in Pro",
        "Team dashboard",
        "Progress tracking",
        "Custom problem sets",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Start free. Upgrade when you&#39;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col h-full ${plan.popular ? "border-foreground" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-foreground text-background text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="pb-6">
                  <CardTitle className="text-lg font-medium">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground ml-1">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-6"
                    variant={plan.variant}
                    onClick={() => {
                      if (plan.name === "Team") {
                        window.location.href = "mailto:"; // add email
                      } else {
                        router.push("/signup");
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              All plans include a 7-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
