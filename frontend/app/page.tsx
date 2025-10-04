"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  const faqs = [
    {
      question: "Why is this different from grinding LeetCode?",
      answer:
        "Solving problems silently is different from explaining your approach while coding. Real interviews test both. We help you practice the part everyone ignores - thinking out loud under pressure.",
    },
    {
      question: "How does the AI interviewer work?",
      answer:
        "It listens as you explain your approach, asks clarifying questions, provides hints when you're stuck, and evaluates both your code and communication. Just like a real interviewer would.",
    },
    {
      question: "What if I freeze up or don't know what to say?",
      answer:
        "That's exactly why you need practice. The AI is patient, you can restart anytime, and we provide prompts to help you structure your thoughts. The more you practice, the more natural it becomes.",
    },
    {
      question: "Do I need to use a specific language?",
      answer:
        "Use whatever language you're interviewing in. Python, JavaScript, Java, C++, Go - the interviewer adapts to your choice.",
    },
    {
      question: "How long should I practice before real interviews?",
      answer:
        "Most users feel confident after 10-15 mock interviews. The key is consistent practice - even 2-3 sessions per week makes a huge difference.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center min-h-[calc(100vh-3.5rem)]">
        <main className="max-w-6xl mx-auto px-4 md:px-6 w-full py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  The best answers
                  <br />
                  <span className="text-muted-foreground">
                    aren&#39;t scripted.
                  </span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Get comfortable explaining your thinking in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  size="default"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/practice")}
                >
                  Start Practicing
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Listen to Example
                </Button>
              </div>

              <div className="pt-6 md:pt-8 grid grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl font-semibold">150+</div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Company patterns
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl font-semibold">45min</div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Real interviews
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl font-semibold">Voice</div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    First approach
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:block hidden">
              <div className="border border-border/50 rounded-lg bg-card p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Offscript • 00:32
                    </div>
                    <p className="text-sm">
                      Can you walk me through your approach to this problem?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      You • 00:45
                    </div>
                    <p className="text-sm">
                      I&#39;m thinking we can use a hash map to store values
                      we&#39;ve seen, then check if the complement exists...
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Offscript • 01:12
                    </div>
                    <p className="text-sm">
                      Good. What would be the time complexity of that approach?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      You • speaking...
                    </div>
                    <div className="h-4 w-1 bg-foreground animate-pulse duration-75" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-12">
              Practice like the real thing
            </h2>

            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">
                    Talk through your approach
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start with any problem. Explain what you&#39;re thinking as
                    you code. No scripts, no memorization - just natural
                    conversation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">
                    Answer follow-up questions
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The AI interviewer asks about complexity, edge cases, and
                    alternative approaches. Get comfortable with the
                    back-and-forth of real interviews.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">
                    Learn from every session
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Review transcripts, see where you hesitated, and get
                    specific feedback on your communication. Each practice makes
                    the next one easier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Common questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about practicing technical
                interviews with voice.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-border/50 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors gap-4"
                  >
                    <span className="text-sm font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-4 text-sm text-muted-foreground border-t border-border/50 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
