import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  score: number;
  icon: ReactNode;
  explanation?: string;
}

const getScoreStatus = (score: number) => {
  if (score >= 80)
    return { text: "Excellent", color: "text-green-600 dark:text-green-400" };
  if (score >= 60)
    return { text: "Good", color: "text-yellow-600 dark:text-yellow-400" };
  return { text: "Needs work", color: "text-red-600 dark:text-red-400" };
};

export function MetricCard({
  title,
  score,
  icon,
  explanation,
}: MetricCardProps) {
  const status = getScoreStatus(score);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">{icon}</div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-semibold">{score}</span>
            <span className={`text-sm ${status.color}`}>{status.text}</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        {explanation && (
          <p className="text-sm text-muted-foreground">{explanation}</p>
        )}
      </CardContent>
    </Card>
  );
}
