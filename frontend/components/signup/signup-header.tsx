"use client";

import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { HashSquareIcon } from "@/components/icons/hash-square";
import { useState, useEffect } from "react";

export function SignupHeader() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0 border-b border-border/50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <HashSquareIcon className="w-6 h-6" />
        <span className="font-semibold text-base">Offscript</span>
      </div>

      {mounted && (
        <button
          onClick={toggleTheme}
          className="relative p-2 hover:bg-muted rounded-md transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 top-2 left-2" />
        </button>
      )}
    </header>
  );
}
