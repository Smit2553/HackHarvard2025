"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="flex-1 flex items-center min-h-[calc(100vh-3.5rem)]">
      <main className="max-w-6xl mx-auto px-4 md:px-6 w-full py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                The best answers
                <br />
                <span className="text-muted-foreground">
                  aren&#39;t scripted.
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Get comfortable explaining your thinking in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                size="default"
                className="w-full sm:w-auto"
                onClick={() => router.push("/practice")}
              >
                Start Practicing
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Listen to Example
              </Button>
            </div>

            <div className="pt-6 md:pt-8 grid grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-1">
                <div className="text-xl md:text-2xl font-semibold">150+</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Company patterns
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl md:text-2xl font-semibold">45min</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Real interviews
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl md:text-2xl font-semibold">Voice</div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  First approach
                </div>
              </div>
            </div>
          </div>

          <div className="lg:block hidden">
            <div className="border border-border/50 rounded-lg bg-card p-6 space-y-4">
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
                    I&#39;m thinking we can use a hash map to store values
                    we&#39;ve seen, then check if the complement exists...
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
    </section>
  );
}
