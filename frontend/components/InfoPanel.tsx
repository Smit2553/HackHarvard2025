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
  loading?: boolean;
  error?: string | null;
}

export default function InfoPanel({
  title,
  type,
  description,
  exampleTestCase,
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
            {type && (
              <span className="inline-flex px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                {type}
              </span>
            )}
          </div>
        )}

        {description && (
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {exampleTestCase && (
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
        )}
      </div>
    </div>
  );
}
