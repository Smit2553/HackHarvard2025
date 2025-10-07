"use client";

interface InfoPanelProps {
  title?: string;
  type?: string;
  description?: string;
  exampleTestCase?: {
    input: string;
    output: string;
    explanation: string;
  };
  details?: {
    examples?: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
    constraints?: string[];
  };
  difficulty?: string;
  tags?: string[];
  loading?: boolean;
  error?: string | null;
}

export default function InfoPanel({
  title,
  type,
  description,
  exampleTestCase,
  details,
  difficulty,
  tags,
  loading = false,
  error = null,
}: InfoPanelProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        {title && (
          <div>
            <h1 className="text-2xl font-semibold mb-2">{title}</h1>
            <div className="flex gap-2 flex-wrap">
              {difficulty && (
                <span
                  className={`inline-flex px-2 py-0.5 text-xs rounded-md font-medium ${
                    difficulty === "Easy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {difficulty}
                </span>
              )}
              {type && (
                <span className="inline-flex px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                  {type}
                </span>
              )}
              {tags &&
                tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        )}

        {description && (
          <div>
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {/* Display examples from details.examples if available, otherwise use exampleTestCase */}
        {details?.examples && details.examples.length > 0 ? (
          <div className="space-y-4">
            {details.examples.map((example, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-sm font-medium">Example {index + 1}:</h3>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Input:
                  </p>
                  <div className="p-3 rounded-md bg-muted/50 border border-border/50">
                    <code className="text-xs whitespace-pre-wrap">
                      {example.input}
                    </code>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Output:
                  </p>
                  <div className="p-3 rounded-md bg-muted/50 border border-border/50">
                    <code className="text-xs whitespace-pre-wrap">
                      {example.output}
                    </code>
                  </div>
                </div>

                {example.explanation && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      Explanation:
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {example.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          exampleTestCase && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Example:</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Input:
                  </p>
                  <div className="p-3 rounded-md bg-muted/50 border border-border/50">
                    <code className="text-xs">{exampleTestCase.input}</code>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Output:
                  </p>
                  <div className="p-3 rounded-md bg-muted/50 border border-border/50">
                    <code className="text-xs">{exampleTestCase.output}</code>
                  </div>
                </div>

                {exampleTestCase.explanation && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      Explanation:
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {exampleTestCase.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Display constraints if available */}
        {details?.constraints && details.constraints.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Constraints:</h3>
            <ul className="space-y-1.5 list-disc list-inside">
              {details.constraints.map((constraint, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
