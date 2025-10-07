"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SettingsSection } from "./settings-section";

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success("Theme updated", {
      description: `Switched to ${value} theme.`,
    });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <SettingsSection
        id="appearance"
        title="Appearance"
        description="Customize your visual preferences"
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium">Theme</Label>
          <div className="h-10 w-full max-w-md bg-muted/50 rounded-md animate-pulse" />
          <p className="text-xs text-muted-foreground">
            Select your preferred color scheme
          </p>
        </div>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      id="appearance"
      title="Appearance"
      description="Customize your visual preferences"
    >
      <div className="space-y-2">
        <Label htmlFor="theme" className="text-sm font-medium">
          Theme
        </Label>
        <Select value={theme || "system"} onValueChange={handleThemeChange}>
          <SelectTrigger className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select your preferred color scheme
        </p>
      </div>
    </SettingsSection>
  );
}
