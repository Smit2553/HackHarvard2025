"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupHeader } from "@/components/signup/signup-header";
import { SignupNavigation } from "@/components/signup/signup-navigation";
import { WelcomeStep } from "@/components/signup/steps/welcome-step";
import { AboutStep } from "@/components/signup/steps/about-step";
import { StatusStep } from "@/components/signup/steps/status-step";
import { ExperienceStep } from "@/components/signup/steps/experience-step";
import { CompanyStep } from "@/components/signup/steps/company-step";
import { PlanStep } from "@/components/signup/steps/plan-step";
import { motion, AnimatePresence } from "framer-motion";

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  status: string;
  experience: string;
  company: string;
  plan: "free" | "pro";
}

const AUTH_STORAGE_KEY = "offscript_auth";

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    fullName: "",
    status: "",
    experience: "",
    company: "",
    plan: "free",
  });

  // Order matches the snippet you referenced (with liquid steps)
  const steps = [
    "welcome",
    "about",
    "status",
    "experience",
    "company",
    "plan",
  ] as const;

  const canProceed = {
    welcome: formData.email.includes("@") && formData.password.length >= 8,
    about: formData.fullName.trim().length >= 2,
    status: formData.status !== "",
    experience: formData.experience !== "",
    company: true, // Optional field
    plan: true,
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create complete user object for auth storage
      const firstName = formData.fullName.trim().split(" ")[0] || "User";
      const userData = {
        email: formData.email,
        name: firstName, // for compact displays
        fullName: formData.fullName.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          formData.fullName.trim() || firstName,
        )}`,
        experience: formData.experience,
        status: formData.status,
        company: formData.company || null,
        plan: formData.plan,
      };

      // Store authentication data in localStorage
      const authData = {
        isLoggedIn: true,
        user: userData,
        signupDate: new Date().toISOString(),
        hasCompletedInterview: false, // Track if user has completed first interview
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      // Redirect to dashboard for personalized experience
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SignupHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 relative">
        <SignupNavigation
          currentStepIndex={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
        />

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {steps[currentStep] === "welcome" && (
                <WelcomeStep
                  email={formData.email}
                  password={formData.password}
                  onEmailChange={(email) => setFormData({ ...formData, email })}
                  onPasswordChange={(password) =>
                    setFormData({ ...formData, password })
                  }
                  onNext={handleNext}
                  canProceed={canProceed.welcome}
                />
              )}

              {steps[currentStep] === "about" && (
                <AboutStep
                  fullName={formData.fullName}
                  onFullNameChange={(fullName) =>
                    setFormData({ ...formData, fullName })
                  }
                  onNext={handleNext}
                  canProceed={canProceed.about}
                />
              )}

              {steps[currentStep] === "status" && (
                <StatusStep
                  status={formData.status}
                  onStatusChange={(status) =>
                    setFormData({ ...formData, status })
                  }
                  onNext={handleNext}
                  canProceed={canProceed.status}
                />
              )}

              {steps[currentStep] === "experience" && (
                <ExperienceStep
                  experience={formData.experience}
                  onExperienceChange={(experience) =>
                    setFormData({ ...formData, experience })
                  }
                  onNext={handleNext}
                  canProceed={canProceed.experience}
                />
              )}

              {steps[currentStep] === "company" && (
                <CompanyStep
                  company={formData.company}
                  onCompanyChange={(company) =>
                    setFormData({ ...formData, company })
                  }
                  onNext={handleNext}
                />
              )}

              {steps[currentStep] === "plan" && (
                <PlanStep
                  plan={formData.plan}
                  status={formData.status}
                  onPlanChange={(plan) => setFormData({ ...formData, plan })}
                  onSubmit={handleSubmit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Liquid step indicator (segmented pills) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "w-8 bg-foreground"
                : index < currentStep
                  ? "w-4 bg-foreground/50"
                  : "w-4 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
