interface OverallScoreDisplayProps {
  score: number;
}

export function OverallScoreDisplay({ score }: OverallScoreDisplayProps) {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex flex-col items-center">
        <div className="text-sm text-muted-foreground mb-2">Overall Score</div>
        <div className="text-6xl md:text-7xl font-bold tracking-tight">
          {score}
        </div>
        <div className="text-lg text-muted-foreground mt-1">out of 100</div>
      </div>
    </div>
  );
}
