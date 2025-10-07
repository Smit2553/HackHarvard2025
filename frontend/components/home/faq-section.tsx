"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
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

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Common questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about practicing technical interviews
              with voice.
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
  );
}
