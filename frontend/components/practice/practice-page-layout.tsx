import { ReactNode } from "react";

interface PracticePageLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function PracticePageLayout({
  children,
  sidebar,
}: PracticePageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-3 gap-x-12 gap-y-8 items-start">
        <div className="lg:col-span-2">{children}</div>
        <div className="lg:block hidden">{sidebar}</div>
      </div>
    </div>
  );
}
