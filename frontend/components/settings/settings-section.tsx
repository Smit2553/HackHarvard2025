import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

interface SettingsSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function SettingsSection({
  id,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section id={id} className="pb-16 scroll-mt-20">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        <Separator />

        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}
