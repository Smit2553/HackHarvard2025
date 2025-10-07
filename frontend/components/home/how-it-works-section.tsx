export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Talk through your approach",
      description:
        "Start with any problem. Explain what you're thinking as you code. No scripts, no memorization - just natural conversation.",
    },
    {
      number: 2,
      title: "Answer follow-up questions",
      description:
        "The AI interviewer asks about complexity, edge cases, and alternative approaches. Get comfortable with the back-and-forth of real interviews.",
    },
    {
      number: 3,
      title: "Learn from every session",
      description:
        "Review transcripts, see where you hesitated, and get specific feedback on your communication. Each practice makes the next one easier.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-12">
            Practice like the real thing
          </h2>

          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium">
                  {step.number}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
