import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

interface ImprovementPoint {
  title: string;
  description: string;
  priority: "high" | "medium";
}

interface DetailedFeedbackProps {
  improvements: ImprovementPoint[];
  loading?: boolean;
}

export function DetailedFeedback({
  improvements,
  loading,
}: DetailedFeedbackProps) {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-8">Detailed Feedback</h2>
      {loading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
            <p className="text-muted-foreground mt-4">
              Generating actionable feedback...
            </p>
          </CardContent>
        </Card>
      ) : improvements.length > 0 ? (
        <div className="space-y-4">
          {improvements.map((improvement, i) => (
            <Card
              key={i}
              className={
                improvement.priority === "high" ? "border-orange-500/20" : ""
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      improvement.priority === "high"
                        ? "bg-orange-500/10"
                        : "bg-muted"
                    }`}
                  >
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{improvement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {improvement.description}
                    </p>
                  </div>
                  {improvement.priority === "high" && (
                    <span className="text-xs px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      High priority
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No specific improvement points were generated for this session.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
