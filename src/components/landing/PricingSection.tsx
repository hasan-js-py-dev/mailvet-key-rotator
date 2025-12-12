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
  },
  {
    name: "Ultimate",
    icon: Crown,
    price: "$29.99",
    period: "/mo",
    description: "Unlimited power for growing teams",
    highlight: "Most Popular Choice",
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
    cta: "Get Ultimate",
    popular: true,
    contactSales: false,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    highlight: "Maximum Power",
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
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background - dark grey #121212 equivalent */}
      <div className="absolute inset-0 bg-[hsl(0_0%_7%)]" />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-primary/80 mb-4 tracking-[0.2em]">PRICING</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 text-[hsl(0_0%_88%)]">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-[hsl(0_0%_60%)] max-w-2xl mx-auto">
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
                plan.popular && "md:-mt-4 md:mb-4 z-10"
              )}
            >
              {/* Card with proper dark surface colors */}
              <div
                className={cn(
                  "relative h-full rounded-2xl transition-all duration-300 overflow-hidden",
                  // Base card surface - #1F1F1F equivalent
                  "bg-[hsl(0_0%_12%)]",
                  // Border styling
                  plan.popular 
                    ? "border-2 border-primary/60" 
                    : "border border-[hsl(0_0%_18%)]",
                  // Hover states - lighten to #252525
                  "hover:bg-[hsl(0_0%_15%)]",
                  "hover:border-[hsl(0_0%_25%)]",
                  plan.popular && "hover:border-primary/80",
                  // Shadow for depth
                  "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
                  plan.popular && "shadow-[0_8px_40px_rgba(109,35,182,0.15)]",
                  plan.popular && "hover:shadow-[0_12px_50px_rgba(109,35,182,0.25)]",
                  // Subtle scale on hover
                  "hover:scale-[1.02]"
                )}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-secondary to-accent py-2 px-4 text-center">
                    <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center justify-center gap-2">
                      <Crown className="w-3.5 h-3.5" />
                      Most Popular
                      <Crown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                <div className={cn("p-8", plan.popular && "pt-14")}>
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      plan.popular 
                        ? "bg-primary/20 group-hover:bg-primary/30" 
                        : plan.name === "Enterprise"
                          ? "bg-accent/15 group-hover:bg-accent/25"
                          : "bg-[hsl(0_0%_20%)] group-hover:bg-[hsl(0_0%_25%)]"
                    )}>
                      <plan.icon className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        plan.popular 
                          ? "text-primary group-hover:text-primary" 
                          : plan.name === "Enterprise"
                            ? "text-accent/80 group-hover:text-accent"
                            : "text-[hsl(0_0%_50%)] group-hover:text-[hsl(0_0%_70%)]"
                      )} />
                    </div>
                    <h3 className={cn(
                      "font-display text-xl font-bold transition-colors duration-300",
                      "text-[hsl(0_0%_88%)] group-hover:text-[hsl(0_0%_95%)]"
                    )}>
                      {plan.name}
                    </h3>
                  </div>
                  
                  <p className="text-[hsl(0_0%_50%)] text-sm mb-6 group-hover:text-[hsl(0_0%_60%)] transition-colors">
                    {plan.description}
                  </p>
                  
                  {/* Price - 32-36px as recommended */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "font-display text-4xl font-bold transition-all duration-300",
                        plan.popular 
                          ? "bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" 
                          : "text-[hsl(0_0%_88%)] group-hover:text-[hsl(0_0%_95%)]"
                      )}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-[hsl(0_0%_45%)] text-base">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-[hsl(0_0%_45%)] mt-1.5 font-medium">
                      {plan.highlight}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[hsl(0_0%_18%)] mb-6 group-hover:bg-[hsl(0_0%_22%)] transition-colors" />

                  {/* Features - 16px text */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                      >
                        {/* Icon in circle - green for included, grey for excluded */}
                        <div className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                          feature.included 
                            ? "bg-[hsl(142_76%_36%_/_0.15)] group-hover:bg-[hsl(142_76%_36%_/_0.25)]" 
                            : "bg-[hsl(0_0%_18%)]"
                        )}>
                          {feature.included ? (
                            <Check className="w-3.5 h-3.5 text-[hsl(142_76%_42%)] group-hover:text-[hsl(142_76%_50%)] transition-colors" />
                          ) : (
                            <X className="w-3 h-3 text-[hsl(0_0%_35%)]" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm transition-colors duration-300",
                            feature.included 
                              ? "text-[hsl(0_0%_75%)] group-hover:text-[hsl(0_0%_85%)]" 
                              : "text-[hsl(0_0%_38%)] line-through"
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
                      className={cn(
                        "w-full font-semibold transition-all duration-300 h-11",
                        plan.popular 
                          ? "bg-gradient-to-r from-primary via-secondary to-accent text-white border-0 hover:opacity-90 hover:shadow-[0_0_30px_rgba(109,35,182,0.4)] hover:scale-[1.02]"
                          : plan.name === "Enterprise"
                            ? "bg-transparent border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                            : "bg-[hsl(0_0%_18%)] border border-[hsl(0_0%_25%)] text-[hsl(0_0%_75%)] hover:bg-[hsl(0_0%_22%)] hover:text-[hsl(0_0%_90%)] hover:border-[hsl(0_0%_30%)]"
                      )}
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex flex-wrap justify-center items-center gap-8 text-sm text-[hsl(0_0%_45%)]">
            <div className="flex items-center gap-2 hover:text-[hsl(0_0%_60%)] transition-colors">
              <Shield className="w-4 h-4 text-[hsl(142_76%_42%)]" />
              <span>30-day money back</span>
            </div>
            <div className="w-px h-4 bg-[hsl(0_0%_20%)] hidden sm:block" />
            <div className="flex items-center gap-2 hover:text-[hsl(0_0%_60%)] transition-colors">
              <Zap className="w-4 h-4 text-[hsl(45_100%_50%)]" />
              <span>Instant activation</span>
            </div>
            <div className="w-px h-4 bg-[hsl(0_0%_20%)] hidden sm:block" />
            <div className="flex items-center gap-2 hover:text-[hsl(0_0%_60%)] transition-colors">
              <Headphones className="w-4 h-4 text-accent" />
              <span>24/7 support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
