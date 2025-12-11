import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Pure black background with animated dot pattern */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-pattern-animated opacity-40" />
      
      {/* Gradient orbs for depth */}
      <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-purple rounded-full blur-[180px] opacity-20 animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/6 w-[600px] h-[600px] bg-blue rounded-full blur-[200px] opacity-15 animate-glow-pulse" style={{ animationDelay: "-1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan rounded-full blur-[150px] opacity-10 animate-glow-pulse" style={{ animationDelay: "-3s" }} />
      
      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">50 Free Credits to Start</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold mb-6"
          >
            <span className="text-foreground">Validate Emails</span>
            <br />
            <span className="gradient-text">with Confidence</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Professional email validation API. Protect your sender reputation with real-time verification that catches invalid, disposable, and catch-all addresses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link to="/access?page=signup">
              <Button variant="hero" size="xl" className="group min-w-[200px]">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="hero-outline" size="xl" className="min-w-[200px]">
                View Pricing
              </Button>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm">Up to 10 emails/sec</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-sm">99.9% Accuracy</span>
            </div>
          </motion.div>
        </div>

        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect behind */}
            <div className="absolute inset-0 gradient-bg rounded-2xl blur-xl opacity-20" />
            
            <div className="relative gradient-border rounded-2xl overflow-hidden">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Terminal header */}
                <div className="bg-muted/50 px-4 py-3 flex items-center gap-3 border-b border-border/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground ml-2">api.mailvet.app/v1/verify-email</span>
                </div>
                
                {/* Code content */}
                <div className="p-6 font-mono text-sm">
                  <pre className="text-left overflow-x-auto">
                    <code className="text-foreground/90">
{`{
  "email": "user@example.com",
  "valid": `}<span className="text-green-400">true</span>{`,
  "result": {
    "code": `}<span className="text-accent">200</span>{`,
    "message": `}<span className="text-primary">"Email is valid and deliverable"</span>{`,
    "domain": {
      "name": "example.com",
      "mx_records": true,
      "catch_all": false
    },
    "risk_level": "low"
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
