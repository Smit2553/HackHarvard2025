import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FAQSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
