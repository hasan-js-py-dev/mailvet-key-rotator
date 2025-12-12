import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown, Rocket, Shield, Mail, FileSpreadsheet, Clock, Users, BarChart3, Headphones, Server, Code, Building2, Timer, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    price: "$0",
    originalPrice: null,
    period: "",
    description: "Try MailVet risk-free",
    highlight: "Perfect to get started",
    limitedOffer: false,
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
    gradient: "from-[hsl(220_15%_18%)] via-[hsl(220_15%_14%)] to-[hsl(220_15%_10%)]",
    hoverGradient: "from-[hsl(220_20%_22%)] via-[hsl(220_20%_18%)] to-[hsl(220_20%_14%)]",
    borderGradient: "from-[hsl(220_15%_30%)] to-[hsl(220_15%_20%)]",
  },
  {
    name: "Ultimate",
    icon: Crown,
    price: "$29.99",
    originalPrice: "$299",
    period: "/mo",
    description: "Unlimited power for growing teams",
    highlight: "Most Popular Choice",
    limitedOffer: true,
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
    cta: "Get Ultimate Now",
    popular: true,
    contactSales: false,
    gradient: "from-[hsl(270_60%_18%)] via-[hsl(280_50%_12%)] to-[hsl(260_40%_8%)]",
    hoverGradient: "from-[hsl(270_70%_25%)] via-[hsl(280_60%_18%)] to-[hsl(260_50%_12%)]",
    borderGradient: "from-[hsl(270_80%_60%)] via-[hsl(300_70%_50%)] to-[hsl(330_80%_55%)]",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    originalPrice: null,
    period: "",
    description: "For large-scale operations",
    highlight: "Maximum Power",
    limitedOffer: false,
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
    gradient: "from-[hsl(200_30%_16%)] via-[hsl(200_25%_12%)] to-[hsl(200_20%_8%)]",
    hoverGradient: "from-[hsl(200_40%_22%)] via-[hsl(200_35%_16%)] to-[hsl(200_30%_12%)]",
    borderGradient: "from-[hsl(180_60%_45%)] to-[hsl(200_70%_50%)]",
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background - rich dark */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-pattern opacity-5" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-[150px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-accent/15 to-blue/15 rounded-full blur-[120px]" 
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-primary mb-4 tracking-[0.2em]">PRICING</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 text-foreground">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative group",
                plan.popular && "md:-mt-6 md:mb-6 z-10"
              )}
            >
              {/* Animated border gradient */}
              <div className={cn(
                "absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm",
                `bg-gradient-to-br ${plan.borderGradient}`
              )} />
              <div className={cn(
                "absolute -inset-[1px] rounded-2xl transition-all duration-500",
                plan.popular 
                  ? `bg-gradient-to-br ${plan.borderGradient} opacity-100`
                  : `bg-gradient-to-br ${plan.borderGradient} opacity-0 group-hover:opacity-60`
              )} />

              {/* Card with gradient background */}
              <div
                className={cn(
                  "relative h-full rounded-2xl transition-all duration-500 overflow-hidden",
                  `bg-gradient-to-br ${plan.gradient}`,
                  "backdrop-blur-xl",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                  "group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]",
                  plan.popular && "shadow-[0_12px_40px_rgba(139,92,246,0.25)]",
                  plan.popular && "group-hover:shadow-[0_20px_60px_rgba(139,92,246,0.35)]",
                  "group-hover:scale-[1.03]"
                )}
              >
                {/* Limited Time Offer Badge for Ultimate */}
                {plan.limitedOffer && (
                  <motion.div 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="absolute top-0 left-0 right-0"
                  >
                    <div className="relative overflow-hidden">
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-2.5 px-4 text-center">
                        <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center justify-center gap-2">
                          <Flame className="w-4 h-4 animate-pulse" />
                          🔥 Limited Time: 90% OFF!
                          <Timer className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Popular badge */}
                {plan.popular && !plan.limitedOffer && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-secondary to-accent py-2 px-4 text-center">
                    <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center justify-center gap-2">
                      <Crown className="w-3.5 h-3.5" />
                      Most Popular
                      <Crown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                <div className={cn("p-8", (plan.popular || plan.limitedOffer) && "pt-16")}>
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className={cn(
                        "p-2.5 rounded-xl transition-all duration-300",
                        plan.popular 
                          ? "bg-gradient-to-br from-purple-500/30 to-pink-500/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
                          : plan.name === "Enterprise"
                            ? "bg-gradient-to-br from-cyan-500/25 to-blue-500/20"
                            : "bg-white/5"
                      )}>
                      <plan.icon className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        plan.popular 
                          ? "text-purple-300" 
                          : plan.name === "Enterprise"
                            ? "text-cyan-300"
                            : "text-white/70"
                      )} />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                      {plan.name}
                      {plan.popular && <span className="text-2xl">👑</span>}
                    </h3>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-6 group-hover:text-white/75 transition-colors">
                    {plan.description}
                  </p>
                  
                  {/* Price section */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {plan.originalPrice && (
                        <span className="text-lg text-white/40 line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className={cn(
                        "font-display text-5xl font-bold transition-all duration-300",
                        plan.popular 
                          ? "bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent" 
                          : "text-white"
                      )}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-white/50 text-lg">{plan.period}</span>
                      )}
                    </div>
                    {plan.originalPrice && (
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-1.5 mt-2 bg-gradient-to-r from-emerald-500/25 to-green-500/25 border border-emerald-400/40 rounded-full px-3 py-1"
                      >
                        <span className="text-xs font-bold text-emerald-300">SAVE $269/mo</span>
                      </motion.div>
                    )}
                    <p className="text-xs text-white/50 mt-2 font-medium">
                      {plan.highlight}
                    </p>
                  </div>

                  {/* Divider with gradient */}
                  <div className={cn(
                    "h-px mb-6 transition-all duration-300",
                    plan.popular 
                      ? "bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
                      : "bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  )} />

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                      >
                        {/* Icon in circle with gradient */}
                        <div className={cn(
                          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
                          feature.included 
                            ? "bg-gradient-to-br from-emerald-400/25 to-green-500/15 shadow-[0_0_12px_rgba(16,185,129,0.25)]" 
                            : "bg-white/5"
                        )}>
                          {feature.included ? (
                            <Check className="w-4 h-4 text-emerald-300" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-white/30" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm transition-colors duration-300",
                            feature.included 
                              ? "text-white/85 group-hover:text-white" 
                              : "text-white/35 line-through"
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
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className={cn(
                          "w-full font-bold transition-all duration-300 h-12 text-base relative overflow-hidden",
                          plan.popular 
                            ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0 shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                            : plan.name === "Enterprise"
                              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-200 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-300/70 hover:text-cyan-100"
                              : "bg-white/10 border border-white/20 text-white/90 hover:bg-white/15 hover:text-white hover:border-white/30"
                        )}
                      >
                        {plan.popular && (
                          <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                          />
                        )}
                        <span className="relative z-10">{plan.cta}</span>
                      </Button>
                    </motion.div>
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center items-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>30-day money back</span>
            </div>
            <div className="w-px h-4 bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant activation</span>
            </div>
            <div className="w-px h-4 bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>24/7 support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
