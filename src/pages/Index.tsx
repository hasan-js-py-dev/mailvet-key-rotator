import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();
  
  // Parallax transforms for glow orbs
  const y1 = useTransform(scrollY, [0, 3000], [0, -400]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -250]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -350]);
  const y4 = useTransform(scrollY, [0, 3000], [0, -200]);
  
  const rotate1 = useTransform(scrollY, [0, 3000], [0, 45]);
  const rotate2 = useTransform(scrollY, [0, 3000], [0, -30]);
  
  const scale1 = useTransform(scrollY, [0, 1500, 3000], [1, 1.2, 0.8]);
  const scale2 = useTransform(scrollY, [0, 1500, 3000], [1, 0.9, 1.1]);
  
  const opacity1 = useTransform(scrollY, [0, 1000, 2000], [0.6, 0.8, 0.4]);
  const opacity2 = useTransform(scrollY, [0, 1000, 2000], [0.5, 0.7, 0.3]);

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
      {/* Parallax glow orbs with smooth animations */}
      <motion.div 
        style={{ y: y1, rotate: rotate1, scale: scale1, opacity: opacity1 }}
        className="glow-orb glow-orb-violet w-[800px] h-[800px] -top-60 -left-60 fixed pointer-events-none"
      />
      <motion.div 
        style={{ y: y2, rotate: rotate2, scale: scale2, opacity: opacity2 }}
        className="glow-orb glow-orb-blue w-[700px] h-[700px] top-1/3 -right-80 fixed pointer-events-none"
      />
      <motion.div 
        style={{ y: y3, scale: scale1 }}
        className="glow-orb glow-orb-violet w-[500px] h-[500px] bottom-1/4 left-1/4 fixed opacity-30 pointer-events-none"
      />
      <motion.div 
        style={{ y: y4, scale: scale2 }}
        className="glow-orb glow-orb-blue w-[400px] h-[400px] bottom-0 right-1/4 fixed opacity-40 pointer-events-none"
      />
      
      {/* Additional floating orbs */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[10%] w-[300px] h-[300px] bg-[hsl(269,100%,53%)] rounded-full blur-[150px] opacity-20 pointer-events-none"
      />
      <motion.div
        animate={{ 
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] right-[5%] w-[350px] h-[350px] bg-[hsl(212,93%,52%)] rounded-full blur-[160px] opacity-15 pointer-events-none"
      />
      
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
