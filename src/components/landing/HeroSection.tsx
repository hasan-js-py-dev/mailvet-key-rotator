import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle, Upload, Check, X, Globe, Server, Mail, Zap, Clock } from "lucide-react";
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

      await new Promise(resolve => setTimeout(resolve, 1000));

      for (let i = 0; i < 4; i++) {
        if (!isMounted) return;
        setValidationStep(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setValidationStep(i + 1);
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      if (!isMounted) return;
      setIsValidating(false);
      setShowResult(true);

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
      {/* Gradient glow effect - purple to indigo to blue */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-cyan rounded-2xl blur-2xl opacity-30" />
      
      <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
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
        <div className="space-y-3 mb-6">
          {validationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isComplete = validationStep > index;
            const isCurrent = validationStep === index && isValidating;
            
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
                        : 'bg-destructive/20 border-2 border-destructive'
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
                        <X className="w-4 h-4 text-destructive" />
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
                          currentEmail.valid || index < 3 ? 'text-green-500' : 'text-destructive'
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
                  : 'bg-destructive/10 border-destructive/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  currentEmail.valid 
                    ? 'bg-green-500 text-white' 
                    : 'bg-destructive text-white'
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
                  <span className={currentEmail.valid ? 'text-green-400' : 'text-destructive'}>
                    {currentEmail.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">MX:</span>
                  <span className={currentEmail.valid ? 'text-green-400' : 'text-destructive'}>
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
            Unlimited bulk verify
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Gradient orbs - purple/indigo/blue palette */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-gradient-to-r from-primary/25 via-secondary/15 to-transparent rounded-full blur-[180px] opacity-50" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-l from-cyan/20 via-secondary/10 to-transparent rounded-full blur-[160px] opacity-40" />
      
      <div className="container mx-auto px-6 relative z-10 py-12 lg:py-20">
        {/* 12-column grid: 7 cols (58%) left, 5 cols (42%) right with 32px gap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7 text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple/10 via-indigo/10 to-blue/10 border border-purple/20 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-blue" />
                <span className="text-sm text-off-white font-medium">Unlimited Bulk Verification • 99% Accuracy</span>
              </div>
            </motion.div>

            {/* Headline - Two lines: off-white first, gradient second */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold tracking-tight mb-6 text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] leading-[1.08]"
            >
              <span className="text-off-white">Unlimited Bulk Email Verification.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple via-indigo to-blue">
                Validate Millions. Pay Less.
              </span>
            </motion.h1>

            {/* Sub-headline - pale cyan for secondary text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-cyan mb-8 max-w-xl leading-relaxed"
            >
              Enterprise-grade unlimited email verification with 99% accuracy. Validate millions of emails instantly, 
              reduce bounce rates by 98%, and protect your sender reputation with our unlimited bulk validation API.
            </motion.p>

            {/* Trust badges - horizontal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
                <Shield className="w-4 h-4 text-purple" />
                <span className="text-sm text-off-white/80">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-off-white/80">99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
                <Clock className="w-4 h-4 text-blue" />
                <span className="text-sm text-off-white/80">&lt;100ms Response</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link to="/access?page=signup">
                <Button 
                  size="lg" 
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-destructive/25 transition-all hover:shadow-destructive/40 group"
                >
                  100 Free Credits
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard/plan">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="font-medium px-8 py-6 text-base rounded-xl border-border/50 hover:bg-muted/50 hover:border-primary/50 transition-all"
                >
                  See Pricing
                </Button>
              </Link>
            </motion.div>
          </div>
          
          {/* Right Content - 5 columns */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ValidationDemo />
          </div>
        </div>
      </div>
    </section>
  );
};
