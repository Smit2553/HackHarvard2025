import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
  variant?: "card" | "plain";
  className?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  variant = "card",
  className,
}: StatCardProps) {
  if (variant === "plain") {
    return (
      <div
        className={`rounded-lg border border-border/50 p-4 ${className || ""}`}
      >
        <div className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </div>
        <div className="text-2xl font-semibold mt-2">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
