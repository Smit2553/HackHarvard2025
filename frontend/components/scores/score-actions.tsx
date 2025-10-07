"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ScoreActions() {
  const router = useRouter();

  return (
    <section className="flex justify-center gap-4">
      <Button variant="outline" size="lg">
        Download Report
      </Button>
      <Button size="lg" onClick={() => router.push("/practice")}>
        Practice Again
      </Button>
    </section>
  );
}
