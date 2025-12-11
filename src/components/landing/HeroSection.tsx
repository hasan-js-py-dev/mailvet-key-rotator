import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle, Star, Upload, Check, X, Globe, Server, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Business emails for animated demo
const businessEmails = [
  { email: "sarah.johnson@techcorp.io", valid: true },
  { email: "mike.chen@startup.com", valid: true },
  { email: "support@invalid-domain-xyz.fake", valid: false },
  { email: "hello@enterprise.co", valid: true },
  { email: "contact@growthmarketing.agency", valid: true },
  { email: "john.doe@nonexistent.test", valid: false },
  { email: "sales@cloudservices.net", valid: true },
];

// Animated email validation demo component
const ValidationDemo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [validationStep, setValidationStep] = useState(0);

  const currentEmail = businessEmails[currentIndex];
  
  const validationSteps = [
    { label: "Syntax Check", icon: Check, status: "checking" },
    { label: "Domain Verification", icon: Globe, status: "checking" },
    { label: "MX Record Lookup", icon: Server, status: "checking" },
    { label: "SMTP Validation", icon: Mail, status: "checking" },
  ];

  useEffect(() => {
    let isMounted = true;
    
    const runValidation = async () => {
      if (!isMounted) return;
      
      setIsValidating(true);
      setShowResult(false);
      setValidationStep(0);

      // Initial delay before starting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Animate through validation steps one by one - slow and smooth
      for (let i = 0; i < 4; i++) {
        if (!isMounted) return;
        setValidationStep(i); // Show current step as "Checking..."
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait while checking
        setValidationStep(i + 1); // Mark as complete
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      if (!isMounted) return;
      setIsValidating(false);
      setShowResult(true);

      // Wait before moving to next email
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (!isMounted) return;
      setCurrentIndex((prev) => (prev + 1) % businessEmails.length);
    };

    runValidation();
    
    return () => {
      isMounted = false;
    };
  }, [currentIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative w-full max-w-md"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-cyan/20 rounded-2xl blur-3xl opacity-40" />
      
      <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Live Validation</span>
          </div>
          <span className="text-xs text-cyan font-mono">v2.0</span>
        </div>

        {/* Email input display */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-background/80 rounded-xl border border-border/40">
          <Mail className="w-4 h-4 text-cyan" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentEmail.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-foreground flex-1 font-mono"
            >
              {currentEmail.email}
            </motion.span>
          </AnimatePresence>
          <div className="flex items-center gap-1">
            {isValidating && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-cyan" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Validation steps */}
        <div className="space-y-4 mb-6">
          {validationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isComplete = validationStep > index;
            const isCurrent = validationStep === index && isValidating;
            const isPending = validationStep < index;
            
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0.3, x: -10 }}
                animate={{ 
                  opacity: isComplete ? 1 : isCurrent ? 1 : 0.4,
                  x: 0,
                }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isComplete 
                      ? currentEmail.valid || index < 3 
                        ? 'bg-green-500/20 border-2 border-green-500' 
                        : 'bg-red-500/20 border-2 border-red-500'
                      : isCurrent 
                        ? 'bg-cyan/20 border-2 border-cyan' 
                        : 'bg-muted/50 border border-border/50'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.8, repeat: isCurrent ? Infinity : 0 }}
                >
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.4 }}
                    >
                      {currentEmail.valid || index < 3 ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <StepIcon className="w-4 h-4 text-cyan" />
                    </motion.div>
                  ) : (
                    <StepIcon className="w-3.5 h-3.5 text-muted-foreground/50" />
                  )}
                </motion.div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm font-medium transition-all duration-500 ${
                    isComplete ? 'text-foreground' : isCurrent ? 'text-cyan' : 'text-muted-foreground/60'
                  }`}>
                    {step.label}
                  </span>
                  <AnimatePresence mode="wait">
                    {isCurrent && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-xs text-cyan font-medium"
                      >
                        Checking...
                      </motion.span>
                    )}
                    {isComplete && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-xs font-medium ${
                          currentEmail.valid || index < 3 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {currentEmail.valid || index < 3 ? 'Passed' : 'Failed'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border ${
                currentEmail.valid 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  currentEmail.valid 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {currentEmail.valid ? 'Deliverable' : 'Invalid'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Score: {currentEmail.valid ? '98' : '12'}/100
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Domain:</span>
                  <span className={currentEmail.valid ? 'text-green-400' : 'text-red-400'}>
                    {currentEmail.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">MX:</span>
                  <span className={currentEmail.valid ? 'text-green-400' : 'text-red-400'}>
                    {currentEmail.valid ? 'Found' : 'Missing'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-5 pt-5 border-t border-border/30">
          <Button variant="outline" className="w-full justify-center gap-2 text-sm border-border/50 hover:bg-muted/50 hover:border-cyan/50 transition-colors">
            <Upload className="w-4 h-4" />
            Bulk verify your list
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Pure black background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[180px] opacity-30" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <div className="text-left">
            {/* Social proof badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card/50 border border-border/30 backdrop-blur-sm">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Trusted by 10,000+ businesses</span>
              </div>
            </motion.div>

            {/* Headline - 48px as requested */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold tracking-tight mb-6"
              style={{ fontSize: '48px', lineHeight: '1.1' }}
            >
              Stop Bounced Emails.{" "}
              <br className="hidden md:block" />
              <span className="gradient-text">Protect Your Sender Reputation</span>
            </motion.h1>

            {/* Subheadline - SEO optimized, unique */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
            >
              Enterprise-grade email verification with 99% accuracy. Validate emails in real-time, 
              reduce bounce rates by 98%, and ensure every message reaches real inboxes.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 mb-10"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan" />
                <span className="text-sm text-foreground font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground font-medium">99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-foreground font-medium">50ms Response</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link to="/access?page=signup">
                <Button 
                  size="lg" 
                  className="bg-cyan hover:bg-cyan/90 text-background font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-cyan/25 transition-all hover:shadow-cyan/40"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">100 free verifications</span>
                <span className="text-xs text-muted-foreground/70">No credit card required</span>
              </div>
            </motion.div>

            {/* Brands/integrations hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 pt-8 border-t border-border/20"
            >
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Integrates with your stack</p>
              <div className="flex items-center gap-6 text-muted-foreground/50">
                <span className="text-sm font-medium">Mailchimp</span>
                <span className="text-sm font-medium">HubSpot</span>
                <span className="text-sm font-medium">Salesforce</span>
                <span className="text-sm font-medium">Zapier</span>
              </div>
            </motion.div>
          </div>

          {/* Right content - Animated Validation demo */}
          <div className="flex justify-center lg:justify-end">
            <ValidationDemo />
          </div>
        </div>
      </div>
    </section>
  );
};
