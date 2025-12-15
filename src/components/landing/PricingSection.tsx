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
    cta: "100 Free Credits",
    popular: false,
    contactSales: false,
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
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(270,100%,2%)]" />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[hsl(267,100%,50%)] to-[hsl(212,93%,52%)] rounded-full blur-[180px]" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[hsl(212,93%,52%)] to-[hsl(195,100%,50%)] rounded-full blur-[150px]" 
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-[hsl(267,100%,60%)] mb-4">PRICING</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 text-white">
            Simple, <span className="marketing-gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-[hsl(270,20%,70%)] max-w-2xl mx-auto">
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
              className={cn("relative group", plan.popular && "md:-mt-6 md:mb-6 z-10")}
            >
              {/* Border gradient */}
              <div className={cn(
                "absolute -inset-[1px] rounded-2xl transition-all duration-500",
                plan.popular 
                  ? "bg-gradient-to-br from-[hsl(267,100%,60%)] via-[hsl(269,100%,53%)] to-[hsl(212,93%,52%)] opacity-100"
                  : "bg-gradient-to-br from-[hsl(270,50%,30%)] to-[hsl(270,50%,20%)] opacity-0 group-hover:opacity-60"
              )} />

              <div className={cn(
                "relative h-full rounded-2xl transition-all duration-500 overflow-hidden",
                "bg-[hsl(270,50%,6%)] backdrop-blur-xl",
                "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                "group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]",
                plan.popular && "shadow-[0_12px_40px_rgba(139,92,246,0.25)]",
                "group-hover:scale-[1.02]"
              )}>
                {/* Limited Time Offer Badge */}
                {plan.limitedOffer && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="relative overflow-hidden">
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-2.5 px-4 text-center">
                        <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center justify-center gap-2">
                          <Flame className="w-4 h-4 animate-pulse" />🔥 Limited Time: 90% OFF!<Timer className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={cn("p-8", plan.limitedOffer && "pt-16")}>
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "p-2.5 rounded-xl transition-all duration-300",
                      plan.popular 
                        ? "bg-gradient-to-br from-[hsl(267,100%,60%)/0.3] to-[hsl(269,100%,53%)/0.2]" 
                        : plan.name === "Enterprise" ? "bg-[hsl(212,93%,52%)/0.15]" : "bg-[hsl(270,50%,15%)]"
                    )}>
                      <plan.icon className={cn(
                        "w-6 h-6",
                        plan.popular ? "text-[hsl(267,100%,70%)]" : plan.name === "Enterprise" ? "text-[hsl(212,93%,60%)]" : "text-[hsl(270,20%,70%)]"
                      )} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                      {plan.name}{plan.popular && <span className="text-2xl">👑</span>}
                    </h3>
                  </div>
                  
                  <p className="text-[hsl(270,20%,60%)] text-sm mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {plan.originalPrice && <span className="text-lg text-[hsl(270,20%,50%)] line-through">{plan.originalPrice}</span>}
                      <span className={cn(
                        "font-display text-5xl font-bold",
                        plan.popular ? "gradient-text" : "text-white"
                      )}>{plan.price}</span>
                      {plan.period && <span className="text-[hsl(270,20%,60%)] text-lg">{plan.period}</span>}
                    </div>
                    {plan.originalPrice && (
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-1.5 mt-2 bg-[hsl(152,76%,45%)/0.15] border border-[hsl(152,76%,45%)/0.3] rounded-full px-3 py-1"
                      >
                        <span className="text-xs font-bold text-[hsl(152,76%,45%)]">SAVE $269/mo</span>
                      </motion.div>
                    )}
                    <p className="text-xs text-[hsl(270,20%,55%)] mt-2">{plan.highlight}</p>
                  </div>

                  <div className={cn("h-px mb-6", plan.popular ? "bg-gradient-to-r from-transparent via-[hsl(267,100%,60%)/0.4] to-transparent" : "bg-[hsl(270,50%,15%)]")} />

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className={cn(
                          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                          feature.included ? "bg-[hsl(152,76%,45%)/0.15]" : "bg-[hsl(270,50%,12%)]"
                        )}>
                          {feature.included ? <Check className="w-4 h-4 text-[hsl(152,76%,45%)]" /> : <X className="w-3.5 h-3.5 text-[hsl(270,20%,50%)]" />}
                        </div>
                        <span className={cn("text-sm", feature.included ? "text-[hsl(270,20%,80%)]" : "text-[hsl(270,20%,45%)] line-through")}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={plan.contactSales ? "mailto:sales@mailvet.io" : "/access?page=signup"} className="block">
                    <Button className={cn(
                      "w-full font-bold h-12 text-base relative overflow-hidden rounded-full",
                      plan.popular 
                        ? "marketing-cta text-white"
                        : plan.name === "Enterprise"
                          ? "bg-[hsl(212,93%,52%)/0.15] border border-[hsl(212,93%,52%)/0.4] text-[hsl(212,93%,70%)] hover:bg-[hsl(212,93%,52%)/0.25]"
                          : "bg-[hsl(270,50%,12%)] border border-[hsl(270,50%,20%)] text-white hover:bg-[hsl(270,50%,15%)]"
                    )}>
                      {plan.popular && (
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                        />
                      )}
                      <span className="relative z-10">{plan.cta}</span>
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
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center items-center gap-8 text-sm text-[hsl(270,20%,60%)]">
            <div className="flex items-center gap-2 hover:text-white transition-colors"><Shield className="w-4 h-4 text-[hsl(152,76%,45%)]" /><span>30-day money back</span></div>
            <div className="w-px h-4 bg-[hsl(270,50%,20%)] hidden sm:block" />
            <div className="flex items-center gap-2 hover:text-white transition-colors"><Zap className="w-4 h-4 text-amber-400" /><span>Instant activation</span></div>
            <div className="w-px h-4 bg-[hsl(270,50%,20%)] hidden sm:block" />
            <div className="flex items-center gap-2 hover:text-white transition-colors"><Headphones className="w-4 h-4 text-[hsl(212,93%,52%)]" /><span>24/7 support</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
