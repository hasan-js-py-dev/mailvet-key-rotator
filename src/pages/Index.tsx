import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBadgesSection } from "@/components/landing/TrustBadgesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";
import { AccuracyComparisonSection } from "@/components/landing/AccuracyComparisonSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { PricingComparisonSection } from "@/components/landing/PricingComparisonSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[hsl(270,100%,2%)] text-[hsl(0,0%,98%)] relative overflow-hidden">
      {/* Luminous swirl orbs - VectorShift style */}
      <div className="glow-orb glow-orb-violet w-[800px] h-[800px] -top-60 -left-60 fixed opacity-60" />
      <div className="glow-orb glow-orb-blue w-[700px] h-[700px] top-1/3 -right-80 fixed opacity-50" />
      <div className="glow-orb glow-orb-violet w-[500px] h-[500px] bottom-1/4 left-1/4 fixed opacity-30" />
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] bottom-0 right-1/4 fixed opacity-40" />
      
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <TrustBadgesSection />
        <HowItWorksSection />
        <FeaturesSection />
        <AccuracyComparisonSection />
        <WhyChooseSection />
        <ComparisonSection />
        <PricingComparisonSection />
        <PricingSection />
        <FAQSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
