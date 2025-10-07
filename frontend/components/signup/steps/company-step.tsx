"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface CompanyStepProps {
  company: string;
  onCompanyChange: (company: string) => void;
  onNext: () => void;
}

export function CompanyStep({
  company,
  onCompanyChange,
  onNext,
}: CompanyStepProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredCompanies = SUGGESTED_COMPANIES.filter((c) =>
    c.toLowerCase().includes(company.toLowerCase()),
  ).slice(0, 5);

  const handleCompanySelect = (selectedCompany: string) => {
    onCompanyChange(selectedCompany);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCompanies.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleCompanySelect(filteredCompanies[selectedIndex]);
        } else {
          onNext();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
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
            value={company}
            onChange={(e) => {
              onCompanyChange(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (suggestionTimeoutRef.current) {
                clearTimeout(suggestionTimeoutRef.current);
              }
              setShowSuggestions(true);
            }}
            onBlur={() => {
              suggestionTimeoutRef.current = setTimeout(() => {
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }, 200);
            }}
            onKeyDown={handleKeyDown}
            className="h-11"
            autoFocus
          />

          {showSuggestions && company && filteredCompanies.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 py-1 border border-border rounded-md bg-background shadow-md z-10">
              {filteredCompanies.map((companyName, index) => (
                <button
                  key={companyName}
                  onClick={() => handleCompanySelect(companyName)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm transition-colors",
                    selectedIndex === index ? "bg-muted" : "hover:bg-muted",
                  )}
                >
                  {companyName}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button onClick={onNext} className="w-full h-11">
          {company ? "Continue" : "Skip"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Optional — skip if you&#39;re just exploring
        </p>
      </div>
    </div>
  );
}
