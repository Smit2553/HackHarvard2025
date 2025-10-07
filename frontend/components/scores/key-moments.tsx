import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface KeyMomentsProps {
  strengths: string[];
  overallComments: string;
}

export function KeyMoments({ strengths, overallComments }: KeyMomentsProps) {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-8">Key Moments</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              What went well
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <ul className="space-y-3">
                {strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No specific strengths identified in this session
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Overall Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {overallComments ||
                "No specific feedback available for this session"}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
