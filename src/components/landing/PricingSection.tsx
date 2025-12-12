import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try MailVet risk-free",
    features: [
      { text: "50 email validations", included: true },
      { text: "Single email validation only", included: true },
      { text: "No CSV bulk upload", included: false },
      { text: "No API access", included: false },
      { text: "No priority support", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
    contactSales: false,
  },
  {
    name: "Ultimate",
    price: "$29.99",
    period: "/mo",
    description: "Unlimited power for growing teams",
    features: [
      { text: "Unlimited email validations/month", included: true },
      { text: "Max 10,000 rows per file", included: true },
      { text: "Bulk CSV upload", included: true },
      { text: "3 emails/second rate limit", included: true },
      { text: "Max 2 concurrent files", included: true },
      { text: "Detailed analytics", included: true },
      { text: "Priority support", included: true },
      { text: "No API access", included: false },
    ],
    cta: "Start Ultimate",
    popular: true,
    contactSales: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    features: [
      { text: "Everything in Ultimate", included: true },
      { text: "Full API access", included: true },
      { text: "Super fast processing", included: true },
      { text: "Unlimited concurrent files", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations & SLA", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
    contactSales: true,
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

                <Link to={plan.contactSales ? "mailto:sales@mailvet.io" : "/access?page=signup"} className="block">
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
