"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Code,
  Palette,
  Bell,
  CreditCard,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface SettingsSection {
  id: string;
  label: string;
  icon: ReactNode;
}

const settingsSections: SettingsSection[] = [
  { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
  { id: "practice", label: "Practice", icon: <Code className="w-4 h-4" /> },
  {
    id: "appearance",
    label: "Appearance",
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-4 h-4" />,
  },
  { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
];

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("account");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup intersection observer for scroll spy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    settingsSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      setMobileMenuOpen(false);
    }
  };

  const activeSectionLabel =
    settingsSections.find((s) => s.id === activeSection)?.label || "Settings";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border/50 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]">
        <div className="flex-1 flex flex-col">
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all",
                  activeSection === section.id
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border/50">
            <button
              onClick={() => {
                localStorage.removeItem("offscript_auth");
                router.push("/");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors text-red-600 dark:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Section Selector */}
      <div className="lg:hidden sticky top-14 z-40 bg-background border-b border-border/50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5"
        >
          <span className="font-medium">{activeSectionLabel}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              mobileMenuOpen && "rotate-180",
            )}
          />
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 border-b border-border/50 bg-background/95 backdrop-blur">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                {section.icon}
                {section.label}
              </button>
            ))}

            <div className="border-t border-border/50">
              <button
                onClick={() => {
                  localStorage.removeItem("offscript_auth");
                  router.push("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-[calc(100vh-3.5rem)]">
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}
