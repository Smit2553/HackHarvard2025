"use client";

import { Navigation } from "@/components/navigation";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { AccountSection } from "@/components/settings/account-section";
import { PracticeSection } from "@/components/settings/practice-section";
import { AppearanceSection } from "@/components/settings/appearance-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { BillingSection } from "@/components/settings/billing-section";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 flex">
        <SettingsLayout>
          <AccountSection />
          <PracticeSection />
          <AppearanceSection />
          <NotificationsSection />
          <BillingSection />
        </SettingsLayout>
      </div>
    </div>
  );
}
