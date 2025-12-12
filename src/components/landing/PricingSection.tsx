import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown, Rocket, Shield, Mail, FileSpreadsheet, Clock, Users, BarChart3, Headphones, Server, Code, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    price: "$0",
    period: "",
    description: "Try MailVet risk-free",
    highlight: "Perfect to get started",
    features: [
      { text: "50 email validations", included: true, icon: Mail },
      { text: "Single email validation only", included: true, icon: Check },
      { text: "No CSV bulk upload", included: false, icon: FileSpreadsheet },
      { text: "No API access", included: false, icon: Code },
      { text: "No priority support", included: false, icon: Headphones },
    ],
    cta: "Start Free",
    popular: false,
    contactSales: false,
    gradient: "from-slate-500/20 via-slate-600/10 to-slate-700/20",
    glowColor: "group-hover:shadow-[0_0_60px_rgba(100,116,139,0.3)]",
    borderGradient: "from-slate-400 via-slate-500 to-slate-600",
    buttonVariant: "outline" as const,
  },
  {
    name: "Ultimate",
    icon: Crown,
    price: "$29.99",
    period: "/mo",
    description: "Unlimited power for growing teams",
    highlight: "👑 Most Popular",
    features: [
      { text: "Unlimited validations/month", included: true, icon: Zap },
      { text: "Max 10,000 rows per file", included: true, icon: FileSpreadsheet },
      { text: "Bulk CSV upload", included: true, icon: FileSpreadsheet },
      { text: "3 emails/second rate", included: true, icon: Clock },
      { text: "Max 2 concurrent files", included: true, icon: Users },
      { text: "Detailed analytics", included: true, icon: BarChart3 },
      { text: "Priority support", included: true, icon: Headphones },
      { text: "No API access", included: false, icon: Code },
    ],
    cta: "🚀 Get Ultimate",
    popular: true,
    contactSales: false,
    gradient: "from-purple-600/30 via-indigo-600/20 to-blue-600/30",
    glowColor: "group-hover:shadow-[0_0_80px_rgba(139,92,246,0.5)]",
    borderGradient: "from-purple-500 via-indigo-500 to-blue-500",
    buttonVariant: "hero" as const,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    highlight: "⚡ Maximum Power",
    features: [
      { text: "Everything in Ultimate", included: true, icon: Crown },
      { text: "Full API access", included: true, icon: Code },
      { text: "Super fast processing", included: true, icon: Rocket },
      { text: "Unlimited concurrent files", included: true, icon: Server },
      { text: "Dedicated account manager", included: true, icon: Users },
      { text: "Custom integrations & SLA", included: true, icon: Shield },
    ],
    cta: "Contact Sales",
    popular: false,
    contactSales: true,
    gradient: "from-cyan-500/20 via-blue-600/15 to-indigo-600/20",
    glowColor: "group-hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]",
    borderGradient: "from-cyan-400 via-blue-500 to-indigo-500",
    buttonVariant: "gradient-outline" as const,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse animation-delay-200" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-accent mb-4">💎 Pricing</p>
          <h2 className="font-display font-bold mb-5">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={cn(
                "relative group",
                plan.popular && "md:-mt-6 md:mb-6 z-10"
              )}
            >
              {/* Animated border gradient */}
              <div className={cn(
                "absolute -inset-[1px] rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm",
                plan.borderGradient
              )} />
              <div className={cn(
                "absolute -inset-[1px] rounded-3xl bg-gradient-to-br opacity-30 group-hover:opacity-100 transition-opacity duration-500",
                plan.borderGradient,
                plan.popular && "opacity-60"
              )} />
              
              {/* Card content */}
              <div
                className={cn(
                  "relative h-full rounded-3xl border border-border/30 transition-all duration-500 overflow-hidden",
                  "bg-gradient-to-br",
                  plan.gradient,
                  plan.glowColor,
                  plan.popular && "border-purple-500/50"
                )}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 blur-lg opacity-60" />
                      <span className="relative block bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-primary-foreground text-sm font-bold px-6 py-2 rounded-b-xl shadow-lg">
                        👑 MOST POPULAR
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative p-8 pt-10">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "p-2.5 rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                      plan.popular 
                        ? "from-purple-500/30 to-indigo-500/30" 
                        : plan.name === "Enterprise" 
                          ? "from-cyan-500/30 to-blue-500/30"
                          : "from-slate-500/30 to-slate-600/30"
                    )}>
                      <plan.icon className={cn(
                        "w-6 h-6",
                        plan.popular ? "text-purple-400" : plan.name === "Enterprise" ? "text-cyan-400" : "text-slate-400"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                        {plan.name}
                        {plan.popular && <span className="text-2xl">👑</span>}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "font-display text-5xl font-bold",
                        plan.popular ? "bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent" : "text-foreground"
                      )}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground text-lg">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.highlight}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                          feature.included 
                            ? "bg-gradient-to-br from-emerald-500/20 to-green-500/20 group-hover:from-emerald-500/30 group-hover:to-green-500/30" 
                            : "bg-muted/30"
                        )}>
                          {feature.included ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/50" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            feature.included ? "text-foreground" : "text-muted-foreground/60"
                          )}
                        >
                          {feature.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link 
                    to={plan.contactSales ? "mailto:sales@mailvet.io" : "/access?page=signup"} 
                    className="block"
                  >
                    <Button
                      variant={plan.buttonVariant}
                      className={cn(
                        "w-full text-base font-semibold transition-all duration-300",
                        plan.popular && "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]",
                        plan.name === "Enterprise" && "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400",
                        plan.name === "Free" && "border-slate-500/50 text-slate-300 hover:bg-slate-500/10 hover:border-slate-400"
                      )}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>30-day money back</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Instant activation</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-blue-400" />
              <span>24/7 support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
