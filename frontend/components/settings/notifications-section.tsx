"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { SettingsSection } from "./settings-section";

export function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState(true);

  const handleSave = () => {
    toast.success("Notifications updated", {
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <SettingsSection
      id="notifications"
      title="Notifications"
      description="Choose what updates you receive"
    >
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5 flex-1">
          <Label htmlFor="email-notif" className="text-sm font-medium">
            Email notifications
          </Label>
          <p className="text-xs text-muted-foreground">
            Receive important updates via email
          </p>
        </div>
        <Switch
          id="email-notif"
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>

      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5 flex-1">
          <Label htmlFor="practice-remind" className="text-sm font-medium">
            Practice reminders
          </Label>
          <p className="text-xs text-muted-foreground">
            Get reminded to keep your skills sharp
          </p>
        </div>
        <Switch
          id="practice-remind"
          checked={practiceReminders}
          onCheckedChange={setPracticeReminders}
          disabled={!emailNotifications}
        />
      </div>

      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5 flex-1">
          <Label htmlFor="weekly-progress" className="text-sm font-medium">
            Weekly progress
          </Label>
          <p className="text-xs text-muted-foreground">
            Summary of your practice sessions and improvements
          </p>
        </div>
        <Switch
          id="weekly-progress"
          checked={weeklyProgress}
          onCheckedChange={setWeeklyProgress}
          disabled={!emailNotifications}
        />
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save changes
        </Button>
      </div>
    </SettingsSection>
  );
}
