"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HashSquareIcon } from "@/components/icons/hash-square";

export default function NotFound() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("offscript_auth");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { isLoggedIn?: boolean };
      setIsLoggedIn(Boolean(parsed?.isLoggedIn));
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center">
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Title + CTAs */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground">
                <HashSquareIcon className="w-3.5 h-3.5" />
                <span className="font-medium tracking-wide">404</span>
                <span className="opacity-70">Page not found</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                You&#39;re way off script.
                <br />
                <span className="text-muted-foreground">
                  This page doesn’t exist.
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground">
                Choose where to go next.
              </p>
            </div>

            {/* Minimal, auth-aware CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-90 transition"
                    aria-label="Go to Dashboard"
                  >
                    Go to Dashboard
                    <span className="ml-2">→</span>
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-border/50 px-4 text-sm font-medium hover:bg-muted/50 transition"
                    aria-label="Back to Home"
                  >
                    Back to Home
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-90 transition"
                    aria-label="Sign in or create account"
                  >
                    Sign in
                    <span className="ml-2">→</span>
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-border/50 px-4 text-sm font-medium hover:bg-muted/50 transition"
                    aria-label="Back to Home"
                  >
                    Back to Home
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Conversation preview to balance layout */}
          <div className="lg:block hidden">
            <div className="relative border border-border/50 rounded-lg bg-card p-6 space-y-4">
              <div className="absolute -top-3 -right-3">
                <div className="rounded-full bg-background border border-border/50 px-3 py-1 text-xs">
                  Offscript
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Offscript • 00:32
                  </div>
                  <p className="text-sm">
                    Can you walk me through your approach to this problem?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    You • 00:45
                  </div>
                  <p className="text-sm">
                    I’m thinking we can use a hash map to store values we’ve
                    seen, then check if the complement exists...
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Offscript • 01:12
                  </div>
                  <p className="text-sm">
                    Good. What would be the time complexity of that approach?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    You • speaking...
                  </div>
                  <div className="h-4 w-1 bg-foreground animate-pulse duration-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
