import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle, Star, Upload, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Floating particles component for vikileads-style background
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 15,
    duration: 10 + Math.random() * 10,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="particles-bg">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            bottom: `-${particle.size * 2}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Email validation demo component
const ValidationDemo = () => {
  const [email] = useState("joe.schmoe@gmail.com");
  const [score] = useState(87);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-cyan/20 rounded-2xl blur-2xl opacity-30" />
      
      <div className="relative bg-card border border-border/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        {/* Email input */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-background rounded-lg border border-border/30">
          <Copy className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground flex-1">{email}</span>
          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 text-xs px-3 py-1 h-7">
            Validate <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {/* Result - Deliverable */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="badge-deliverable">Deliverable</span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-1">This address accepts email</p>
            <p className="text-xs text-muted-foreground">The recipient's email server has confirmed its deliverability.</p>
          </div>

          <div className="border-t border-border/30 pt-4">
            <span className="badge-deliverable mb-2">Deliverable</span>
            <p className="text-sm font-medium text-foreground mt-2 mb-3">This email address is valid</p>
            
            {/* Score bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div className="score-bar h-full rounded-full" style={{ width: '100%' }} />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground border-2 border-background rounded-full shadow-lg"
                  style={{ left: `${score}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-4">
            <p className="text-xs text-muted-foreground mb-3">Or instead</p>
            <Button variant="outline" className="w-full justify-center gap-2 text-sm border-border/50 hover:bg-muted/50">
              <Upload className="w-4 h-4" />
              Upload a list
            </Button>
          </div>
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
      
      {/* Animated dot pattern */}
      <div className="absolute inset-0 dot-pattern-animated opacity-30" />
      
      {/* Floating particles - vikileads style */}
      <FloatingParticles />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan/20 rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue/20 rounded-full blur-[120px] opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-left">
            {/* Social proof badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">+10,572 users</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Simple, fast{" "}
              <span className="inline-flex items-center">
                <span className="text-red-500 mx-1">⚡</span>
              </span>
              , and secure{" "}
              <span className="inline-flex items-center">
                <span className="text-green-500 mx-1">🔒</span>
              </span>
              <br />
              <span className="gradient-text">email validation service</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              Email Validation API: Clean Lists, Boost Deliverability & Maximize ROI. 
              Remove fake emails and spam users from your email lists.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 mb-10"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">99.99% availability</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-6"
            >
              <div className="flex flex-col items-start">
                <Link to="/access?page=signup">
                  <Button 
                    size="lg" 
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-6 text-base rounded-full shadow-lg shadow-red-500/25"
                  >
                    Get started for free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <span className="text-xs text-cyan mt-3 ml-2">Includes 50 free credits</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                <span className="text-lg">↖</span>
                <span>No credit<br />card required!</span>
              </div>
            </motion.div>
          </div>

          {/* Right content - Validation demo */}
          <div className="flex justify-center lg:justify-end">
            <ValidationDemo />
          </div>
        </div>
      </div>
    </section>
  );
};