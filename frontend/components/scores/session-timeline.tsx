import { Card, CardContent } from "@/components/ui/card";
import { formatClock } from "@/lib/format";
import { TranscriptSegment } from "@/lib/types";

interface SessionTimelineProps {
  transcript: TranscriptSegment[];
  loading?: boolean;
}

export function SessionTimeline({ transcript, loading }: SessionTimelineProps) {
  const messages = transcript.filter((s) => s.type === "transcript");

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-8">Full Conversation</h2>
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
              <p className="text-muted-foreground mt-4">
                Loading transcript...
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.map((segment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      segment.role === "user" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {segment.role === "user" ? "You" : "Offscript"} •{" "}
                      {formatClock(segment.secondsSinceStart)}
                    </div>
                    <p className="text-sm">{segment.text}</p>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No conversation messages in this transcript
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
