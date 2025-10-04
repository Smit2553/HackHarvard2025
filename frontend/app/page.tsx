"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Home page - redirects to the interview start page
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/start");
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
