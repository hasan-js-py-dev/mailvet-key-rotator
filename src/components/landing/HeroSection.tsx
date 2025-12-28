import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle, Upload, Check, X, Globe, Server, Mail, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const businessEmails = [
  { email: "sarah.johnson@techcorp.io", valid: true },
  { email: "mike.chen@startup.com", valid: true },
  { email: "support@invalid-domain-xyz.fake", valid: false },
  { email: "hello@enterprise.co", valid: true },
  { email: "contact@growthmarketing.agency", valid: true },
  { email: "john.doe@nonexistent.test", valid: false },
  { email: "sales@cloudservices.net", valid: true },
];

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
      className="relative w-full max-w-md sm:max-w-lg"
    >
      {/* Gradient glow effect */}
      <div className="absolute -inset-3 bg-gradient-to-r from-[hsl(264,100%,35%)] via-[hsl(269,100%,53%)] to-[hsl(212,93%,52%)] rounded-3xl blur-2xl opacity-30" />
      
      <div className="relative bg-[hsl(270,50%,6%)]/95 backdrop-blur-xl border border-[hsl(270,50%,20%)] rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-xs text-[hsl(270,20%,65%)] font-medium">Live Validation</span>
          </div>
          <span className="text-xs text-[hsl(267,100%,60%)] font-mono">v2.0</span>
        </div>

        {/* Email input display */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-[hsl(270,50%,10%)] rounded-xl border border-[hsl(270,50%,15%)]">
          <Mail className="w-4 h-4 text-[hsl(212,93%,52%)]" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentEmail.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-white flex-1 font-mono"
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
                <Zap className="w-4 h-4 text-[hsl(267,100%,60%)]" />
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
                        ? 'bg-emerald/20 border-2 border-emerald' 
                        : 'bg-destructive/20 border-2 border-destructive'
                      : isCurrent 
                        ? 'bg-[hsl(267,100%,60%)]/20 border-2 border-[hsl(267,100%,60%)]' 
                        : 'bg-[hsl(270,50%,10%)] border border-[hsl(270,50%,20%)]'
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
                        <Check className="w-4 h-4 text-emerald" />
                      ) : (
                        <X className="w-4 h-4 text-destructive" />
                      )}
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <StepIcon className="w-4 h-4 text-[hsl(267,100%,60%)]" />
                    </motion.div>
                  ) : (
                    <StepIcon className="w-3.5 h-3.5 text-[hsl(270,20%,50%)]" />
                  )}
                </motion.div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm font-medium transition-all duration-500 ${
                    isComplete ? 'text-white' : isCurrent ? 'text-[hsl(267,100%,60%)]' : 'text-[hsl(270,20%,50%)]'
                  }`}>
                    {step.label}
                  </span>
                  <AnimatePresence mode="wait">
                    {isCurrent && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-xs text-[hsl(267,100%,60%)] font-medium"
                      >
                        Checking...
                      </motion.span>
                    )}
                    {isComplete && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-xs font-medium ${
                          currentEmail.valid || index < 3 ? 'text-emerald' : 'text-destructive'
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
                  ? 'bg-emerald/10 border-emerald/30' 
                  : 'bg-destructive/10 border-destructive/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  currentEmail.valid 
                    ? 'bg-emerald text-white' 
                    : 'bg-destructive text-white'
                }`}>
                  {currentEmail.valid ? 'Deliverable' : 'Invalid'}
                </span>
                <span className="text-xs text-[hsl(270,20%,65%)]">
                  Score: {currentEmail.valid ? '98' : '12'}/100
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-[hsl(270,20%,65%)]" />
                  <span className="text-[hsl(270,20%,65%)]">Domain:</span>
                  <span className={currentEmail.valid ? 'text-emerald' : 'text-destructive'}>
                    {currentEmail.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-3 h-3 text-[hsl(270,20%,65%)]" />
                  <span className="text-[hsl(270,20%,65%)]">MX:</span>
                  <span className={currentEmail.valid ? 'text-emerald' : 'text-destructive'}>
                    {currentEmail.valid ? 'Found' : 'Missing'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-5 pt-5 border-t border-[hsl(270,50%,15%)]">
          <Button variant="outline" className="w-full justify-center gap-2 text-sm bg-transparent border-[hsl(270,50%,20%)] text-white hover:bg-[hsl(270,50%,10%)] hover:border-[hsl(267,100%,60%)]/50 transition-colors rounded-xl">
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
    <section className="relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 relative z-10 py-14 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 flex justify-center lg:justify-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(270,50%,10%)] border border-[hsl(270,50%,20%)] backdrop-blur-sm">
                <Zap className="w-4 h-4 text-[hsl(267,100%,60%)]" />
                <span className="text-xs sm:text-sm text-[hsl(270,20%,75%)] font-medium">Unlimited Bulk Verification • 99% Accuracy</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold tracking-tight mb-6 text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] leading-[1.06]"
            >
              <span className="text-white">Unlimited Bulk Email Verification.</span>
              <br />
              <span className="marketing-gradient-text">
                Validate Millions. Pay Less.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[hsl(270,20%,70%)] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Enterprise-grade unlimited email verification with 99% accuracy. Validate millions of emails instantly, 
              reduce bounce rates by 98%, and protect your sender reputation with our unlimited bulk validation API.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(270,50%,8%)] border border-[hsl(270,50%,15%)]">
                <Shield className="w-4 h-4 text-[hsl(267,100%,60%)]" />
                <span className="text-xs sm:text-sm text-[hsl(270,20%,70%)]">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(270,50%,8%)] border border-[hsl(270,50%,15%)]">
                <CheckCircle className="w-4 h-4 text-emerald" />
                <span className="text-xs sm:text-sm text-[hsl(270,20%,70%)]">99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(270,50%,8%)] border border-[hsl(270,50%,15%)]">
                <Clock className="w-4 h-4 text-[hsl(212,93%,52%)]" />
                <span className="text-xs sm:text-sm text-[hsl(270,20%,70%)]">&lt;100ms Response</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <Link to="/access?page=signup">
                <Button 
                  size="lg" 
                  className="marketing-cta text-white font-semibold px-8 py-6 text-base rounded-full group w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get started free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <a href="#pricing">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="font-medium px-8 py-6 text-base rounded-full bg-transparent border-[hsl(270,50%,20%)] text-white hover:bg-[hsl(270,50%,10%)] hover:border-[hsl(270,50%,30%)] transition-all w-full sm:w-auto"
                >
                  See Pricing
                </Button>
              </a>
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
