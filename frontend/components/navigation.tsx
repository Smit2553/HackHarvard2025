"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  HashSquareIcon,
  HashSquareSolidIcon,
} from "@/components/icons/hash-square";

export function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b border-border/50 px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4 md:gap-6">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => {
            router.push("/");
            setMobileMenuOpen(false);
          }}
        >
          <div className="relative w-6 h-6">
            <HashSquareIcon className="absolute inset-0 group-hover:opacity-0" />
            <HashSquareSolidIcon className="absolute inset-0 opacity-0 group-hover:opacity-100" />
          </div>
          <span className="font-semibold text-base">Offscript</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Problems
          </button>
          <button
            onClick={() => router.push("/practice/companies")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Companies
          </button>
          <button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => router.push("/pricing")}
          >
            Pricing
          </button>
        </nav>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>
        )}

        <button className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-md hover:bg-muted flex items-center">
          Sign in
        </button>

        <Button
          size="sm"
          className="h-9"
          onClick={() => router.push("/practice")}
        >
          Start Practice
        </Button>
      </div>

      <div className="flex md:hidden items-center gap-2">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>
        )}

        <button
          className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-14 left-0 right-0 bg-background border-b border-border/50 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-1">
              {["Problems", "Companies", "Pricing"].map((item) => (
                <button
                  key={item}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left px-3 py-2 rounded-md hover:bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </button>
              ))}

              <div className="pt-3 border-t border-border/50 space-y-2">
                <button
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full px-3 py-2 rounded-md hover:bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </button>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/practice");
                  }}
                >
                  Start Practice
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
