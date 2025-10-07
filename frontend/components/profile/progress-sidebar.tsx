import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function ProgressSidebar() {
  return (
    <div className="lg:block hidden">
      <div className="sticky top-8 space-y-6">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Your progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Sessions completed
              </span>
              <span className="text-sm font-medium">28</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Problems solved
              </span>
              <span className="text-sm font-medium">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Practice time
              </span>
              <span className="text-sm font-medium">21 hrs</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" />
            <h3 className="font-medium text-sm">Most practiced this week</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Google</span>
              <span className="text-muted-foreground">2.3k sessions</span>
            </div>
            <div className="flex justify-between">
              <span>Meta</span>
              <span className="text-muted-foreground">1.8k sessions</span>
            </div>
            <div className="flex justify-between">
              <span>Amazon</span>
              <span className="text-muted-foreground">1.5k sessions</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
