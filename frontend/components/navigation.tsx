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
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Pricing
          </button>
        </nav>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>
        )}

        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2">
          Sign in
        </button>
        <Button size="sm" onClick={() => router.push("/practice")}>
          Start Practice
        </Button>
      </div>

      <div className="flex md:hidden items-center gap-2">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>
        )}

        <button
          className="w-9 h-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
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
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
                closed: {
                  transition: {
                    staggerChildren: 0.03,
                    staggerDirection: -1,
                  },
                },
              }}
              className="flex flex-col p-4 space-y-1"
            >
              {["Problems", "Companies", "Pricing"].map((item) => (
                <motion.button
                  key={item}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left px-3 py-2 rounded-md hover:bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.button>
              ))}

              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                className="pt-3 border-t border-border/50 space-y-2"
              >
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
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
