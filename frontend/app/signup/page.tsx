"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Sun, Moon } from "lucide-react";
import { HashSquareIcon } from "@/components/icons/hash-square";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  experience: string;
  status: string;
  company: string;
  plan: "free" | "pro";
}

const STEPS = [
  "welcome",
  "about",
  "experience",
  "status",
  "company",
  "plan",
] as const;
type Step = (typeof STEPS)[number];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", desc: "Learning the basics" },
  { value: "intermediate", label: "Intermediate", desc: "1-3 years" },
  { value: "advanced", label: "Advanced", desc: "3-5 years" },
  { value: "expert", label: "Expert", desc: "5+ years" },
];

const STATUS_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "employed", label: "Employed" },
  { value: "seeking", label: "Job seeking" },
  { value: "switching", label: "Switching" },
];

const SUGGESTED_COMPANIES = [
  "Google",
  "Meta",
  "Amazon",
  "Microsoft",
  "Apple",
  "Netflix",
  "Uber",
  "Stripe",
  "Airbnb",
  "Spotify",
  "OpenAI",
  "Anthropic",
  "LinkedIn",
  "Salesforce",
];

export default function SignupPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    fullName: "",
    experience: "",
    status: "",
    company: "",
    plan: "free",
  });
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStepIndex = STEPS.indexOf(currentStep);

  const updateFormData = <K extends keyof SignupData>(
    field: K,
    value: SignupData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSubmit = async () => {
    console.log("Signup data:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(formData.plan === "pro" ? "/payment" : "/practice");
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && canProceed()) {
      action();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "welcome":
        return formData.email && formData.password.length >= 8;
      case "about":
        return formData.fullName.trim().length > 0;
      case "experience":
        return formData.experience !== "";
      case "status":
        return formData.status !== "";
      case "company":
        return true; // Optional
      case "plan":
        return true;
      default:
        return false;
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const filteredCompanies = SUGGESTED_COMPANIES.filter((company) =>
    company.toLowerCase().includes(formData.company.toLowerCase()),
  ).slice(0, 5);

  const handleCompanySelect = (company: string) => {
    updateFormData("company", company);
    setShowCompanySuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleCompanyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCompanySuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < filteredCompanies.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleCompanySelect(filteredCompanies[selectedSuggestionIndex]);
        } else if (canProceed()) {
          nextStep();
        }
        break;
      case "Escape":
        setShowCompanySuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Simple header - just logo and theme toggle */}
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

      {/* Main content with absolute positioned navigation */}
      <main className="flex-1 flex items-center justify-center px-4 relative">
        {/* Back button and progress - absolutely positioned */}
        {currentStepIndex > 0 && (
          <>
            <button
              onClick={prevStep}
              className="absolute top-6 left-4 md:left-6 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Back
            </button>

            {currentStepIndex < STEPS.length - 1 && (
              <span className="absolute top-6 right-4 md:right-6 text-xs text-muted-foreground">
                {currentStepIndex} of {STEPS.length - 1}
              </span>
            )}
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
          >
            {/* Welcome Step */}
            {currentStep === "welcome" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">
                    Create your account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Join thousands practicing interviews
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, nextStep)}
                    className="h-11"
                    autoFocus
                  />

                  <Input
                    type="password"
                    placeholder="Password (8+ characters)"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, nextStep)}
                    className="h-11"
                  />

                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="w-full h-11"
                  >
                    Continue
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/")}
                    className="cursor-pointer underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {/* About Step */}
            {currentStep === "about" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">
                    What&#39;s your name?
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    We&#39;ll use this in your sessions
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, nextStep)}
                    className="h-11 text-center"
                    autoFocus
                  />

                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="w-full h-11"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Experience Step */}
            {currentStep === "experience" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">Experience level</h1>
                  <p className="text-sm text-muted-foreground">
                    We&#39;ll match the difficulty
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => {
                          updateFormData("experience", level.value);
                        }}
                        className={cn(
                          "py-3.5 px-4 rounded-md border text-left transition-colors",
                          formData.experience === level.value
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        <div className="text-sm font-medium leading-none">
                          {level.label}
                        </div>
                        <div className="text-xs mt-1 opacity-70">
                          {level.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="w-full h-11"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Status Step */}
            {currentStep === "status" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">Current status</h1>
                  <p className="text-sm text-muted-foreground">
                    Help us personalize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateFormData("status", option.value);
                        }}
                        className={cn(
                          "py-4 px-4 rounded-md border text-sm font-medium transition-colors",
                          formData.status === option.value
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="w-full h-11"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Company Step */}
            {currentStep === "company" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">Target company</h1>
                  <p className="text-sm text-muted-foreground">
                    We&#39;ll prioritize their patterns
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Type company name..."
                      value={formData.company}
                      onChange={(e) => {
                        updateFormData("company", e.target.value);
                        setShowCompanySuggestions(true);
                        setSelectedSuggestionIndex(-1);
                      }}
                      onFocus={() => {
                        if (suggestionTimeoutRef.current) {
                          clearTimeout(suggestionTimeoutRef.current);
                        }
                        setShowCompanySuggestions(true);
                      }}
                      onBlur={() => {
                        suggestionTimeoutRef.current = setTimeout(() => {
                          setShowCompanySuggestions(false);
                          setSelectedSuggestionIndex(-1);
                        }, 200);
                      }}
                      onKeyDown={handleCompanyKeyDown}
                      className="h-11"
                      autoFocus
                    />

                    {/* Autocomplete suggestions */}
                    {showCompanySuggestions &&
                      formData.company &&
                      filteredCompanies.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 py-1 border border-border rounded-md bg-background shadow-md z-10">
                          {filteredCompanies.map((company, index) => (
                            <button
                              key={company}
                              onClick={() => handleCompanySelect(company)}
                              className={cn(
                                "w-full px-3 py-2 text-left text-sm transition-colors",
                                selectedSuggestionIndex === index
                                  ? "bg-muted"
                                  : "hover:bg-muted",
                              )}
                            >
                              {company}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  <Button onClick={nextStep} className="w-full h-11">
                    {formData.company ? "Continue" : "Skip"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Optional — skip if you&#39;re just exploring
                  </p>
                </div>
              </div>
            )}

            {/* Plan Step */}
            {currentStep === "plan" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">Choose your plan</h1>
                  <p className="text-sm text-muted-foreground">
                    You can upgrade anytime
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => updateFormData("plan", "free")}
                    className={cn(
                      "w-full p-4 rounded-lg border text-left transition-all",
                      formData.plan === "free"
                        ? "border-foreground"
                        : "border-border hover:border-border/80",
                    )}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">Free</div>
                      <div className="text-sm text-muted-foreground">
                        3 interviews/week • Basic features
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => updateFormData("plan", "pro")}
                    className={cn(
                      "w-full p-4 rounded-lg border text-left transition-all relative",
                      formData.plan === "pro"
                        ? "border-foreground"
                        : "border-border hover:border-border/80",
                    )}
                  >
                    <div className="absolute -top-2.5 right-4">
                      <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded-full">
                        {formData.status === "seeking"
                          ? "Best for you"
                          : "Recommended"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium flex items-baseline gap-2">
                        Pro
                        <span className="text-sm font-normal text-muted-foreground">
                          $19/month
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Unlimited • AI feedback • All features
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        7-day free trial
                      </div>
                    </div>
                  </button>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleSubmit} className="w-full h-11">
                    {formData.plan === "free"
                      ? "Start practicing"
                      : "Start free trial"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Looking for team plans?{" "}
                    <button
                      onClick={() => router.push("/pricing")}
                      className="cursor-pointer underline underline-offset-4 hover:text-foreground transition-colors"
                    >
                      Contact us
                    </button>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
