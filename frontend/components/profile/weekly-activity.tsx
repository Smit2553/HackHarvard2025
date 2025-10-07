import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface DayActivity {
  day: string;
  sessions: number;
}

interface WeeklyActivityProps {
  weeklyProgress: DayActivity[];
}

export function WeeklyActivity({ weeklyProgress }: WeeklyActivityProps) {
  const maxSessions = Math.max(...weeklyProgress.map((d) => d.sessions));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          This Week&#39;s Activity
        </CardTitle>
        <CardDescription>Sessions completed each day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-32">
          {weeklyProgress.map((day) => (
            <div
              key={day.day}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full bg-muted rounded-t flex flex-col justify-end"
                style={{ height: "100%" }}
              >
                <div
                  className="bg-foreground rounded-t transition-all duration-300"
                  style={{
                    height: `${(day.sessions / maxSessions) * 100 || 5}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
