import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$9.99",
    period: "/mo",
    description: "Perfect for small projects",
    features: [
      { text: "50 free credits included", included: true },
      { text: "1 email/second rate limit", included: true },
      { text: "Single email validation", included: true },
      { text: "API access", included: true },
      { text: "CSV bulk upload", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/mo",
    description: "For growing businesses",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "3 emails/second rate limit", included: true },
      { text: "CSV bulk upload", included: true },
      { text: "Priority support", included: true },
      { text: "Detailed analytics", included: true },
      { text: "Webhook notifications", included: true },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Ultimate",
    price: "$29.99",
    period: "/mo",
    description: "Maximum power for enterprise",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "10 emails/second rate limit", included: true },
      { text: "Dedicated support", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantee", included: true },
      { text: "White-label options", included: true },
    ],
    cta: "Go Ultimate",
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-accent mb-4">Pricing</p>
          <h2 className="font-display font-bold mb-5">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include 50 free credits to get started.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative",
                plan.popular && "md:-mt-4 md:mb-4"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="gradient-bg text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "h-full p-7 rounded-2xl border transition-all duration-300",
                  plan.popular
                    ? "gradient-border bg-card shadow-glow border-transparent"
                    : "border-border/50 bg-card/50 hover:border-primary/30"
                )}
              >
                <div className="mb-7">
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-5">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 mb-7">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/access?page=signup" className="block">
                  <Button
                    variant={plan.popular ? "hero" : "gradient-outline"}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
