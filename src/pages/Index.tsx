import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { ApiSection } from "@/components/landing/ApiSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Footer } from "@/components/landing/Footer";
import { FallingDots } from "@/components/FallingDots";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Random falling dots background */}
      <FallingDots />
      
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <WhyChooseSection />
        <UseCasesSection />
        <ApiSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;