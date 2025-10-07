"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SettingsSection } from "./settings-section";

export function AccountSection() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const handleSave = () => {
    toast.success("Account updated", {
      description: "Your account settings have been saved.",
    });
  };

  return (
    <SettingsSection
      id="account"
      title="Account"
      description="Manage your account details"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-md"
        />
        <p className="text-xs text-muted-foreground">
          This is how the AI interviewer will address you
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-md"
        />
        <p className="text-xs text-muted-foreground">
          Used for notifications and account recovery
        </p>
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save changes
        </Button>
      </div>
    </SettingsSection>
  );
}
