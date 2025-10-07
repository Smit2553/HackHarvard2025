"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SignupHeader } from "@/components/signup/signup-header";
import { SignupNavigation } from "@/components/signup/signup-navigation";
import { WelcomeStep } from "@/components/signup/steps/welcome-step";
import { AboutStep } from "@/components/signup/steps/about-step";
import { ExperienceStep } from "@/components/signup/steps/experience-step";
import { StatusStep } from "@/components/signup/steps/status-step";
import { CompanyStep } from "@/components/signup/steps/company-step";
import { PlanStep } from "@/components/signup/steps/plan-step";

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

export default function SignupPage() {
  const router = useRouter();
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

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "welcome":
        return !!formData.email && formData.password.length >= 8;
      case "about":
        return formData.fullName.trim().length > 0;
      case "experience":
        return !!formData.experience;
      case "status":
        return !!formData.status;
      case "company":
        return true; // Optional
      case "plan":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <SignupHeader />

      <main className="flex-1 flex items-center justify-center px-4 relative">
        <SignupNavigation
          currentStepIndex={currentStepIndex}
          totalSteps={STEPS.length}
          onBack={prevStep}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
          >
            {currentStep === "welcome" && (
              <WelcomeStep
                email={formData.email}
                password={formData.password}
                onEmailChange={(email) => updateFormData("email", email)}
                onPasswordChange={(password) =>
                  updateFormData("password", password)
                }
                onNext={nextStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === "about" && (
              <AboutStep
                fullName={formData.fullName}
                onFullNameChange={(name) => updateFormData("fullName", name)}
                onNext={nextStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === "experience" && (
              <ExperienceStep
                experience={formData.experience}
                onExperienceChange={(exp) => updateFormData("experience", exp)}
                onNext={nextStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === "status" && (
              <StatusStep
                status={formData.status}
                onStatusChange={(status) => updateFormData("status", status)}
                onNext={nextStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === "company" && (
              <CompanyStep
                company={formData.company}
                onCompanyChange={(company) =>
                  updateFormData("company", company)
                }
                onNext={nextStep}
              />
            )}

            {currentStep === "plan" && (
              <PlanStep
                plan={formData.plan}
                status={formData.status}
                onPlanChange={(plan) => updateFormData("plan", plan)}
                onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
