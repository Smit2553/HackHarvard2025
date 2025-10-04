import React from "react";

type Props = {
  communicationScore?: number;
  problemSolvingScore?: number;
  implementationScore?: number;
  transcript?: string;
  improvements?: string[];
};

export default function ScoreOverviewPage({
  communicationScore = 82,
  problemSolvingScore = 75,
  implementationScore = 90,
  transcript = "Transcript will appear here...",
  improvements = [
    "Improvement 1 placeholder",
    "Improvement 2 placeholder",
    "Improvement 3 placeholder",
  ],
}: Props) {
  const average = Math.round(
    (communicationScore + problemSolvingScore + implementationScore) / 3
  );

  const MetricCard: React.FC<{
    title: string;
    score: number;
    explanation?: string;
  }> = ({ title, score, explanation }) => {
    // progress width in percent
    const pct = Math.max(0, Math.min(100, score));
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-900">{title}</h3>
          <div className="text-xl font-bold">{score}/100</div>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full bg-gradient-to-r from-green-400 to-indigo-600`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="h-28 bg-gray-50 rounded p-3 overflow-auto">
          <p className="text-sm text-gray-700">Why the response was good/bad:</p>
          <p className="mt-2 text-sm text-gray-600">{explanation || `No details provided.`}</p>
        </div>
      </div>
    );
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Score Overview</h1>
      </header>

      <section className="flex flex-col items-center mb-8">
        {/* Circle showing split with average and score */}
        <div className="mb-10">
          <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg z-10">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm">Average</div>
                  <div className="text-2xl font-bold">{average}</div>
                </div>
              </div>
              <div className="w-1/2 bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Score</div>
                  <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-900">{average}/100</div>
                </div>
              </div>
            </div>
            {/* vertical divider */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/50" />
          </div>
        </div>

        {/* Three metrics */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <MetricCard title="Communication" score={communicationScore} explanation={undefined} />
          <MetricCard title="Problem Solving" score={problemSolvingScore} explanation={undefined} />
          <MetricCard title="Implementation" score={implementationScore} explanation={undefined} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Session Overview</h2>
        <div className="bg-white rounded-lg shadow p-4">
          {/* Transcript placeholder - replace with variable or prop in future */}
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{transcript}</pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Improvements</h2>
        <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {improvements.map((imp, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-900">Improvement {i + 1}</h4>
              <p className="text-sm text-gray-700">{imp}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
