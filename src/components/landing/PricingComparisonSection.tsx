import { motion } from "framer-motion";
import { Check, Star, ExternalLink, Flame, Infinity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pricingData = [
  { 
    name: "MailVet", 
    free: "$0",
    popular: "$29.99/mo",
    enterprise: "Custom", 
    model: "Unlimited",
    limitedOffer: "90% OFF",
    highlight: true,
    website: null,
    note: "Unlimited verifications on all paid plans"
  },
  { 
    name: "ZeroBounce", 
    free: "$0 (100)",
    popular: "$99/mo",
    enterprise: "$499/mo+", 
    model: "Credit-based",
    limitedOffer: null,
    highlight: false,
    website: "https://www.zerobounce.net/email-validation-pricing",
    note: "Monthly credit limits apply"
  },
  { 
    name: "NeverBounce", 
    free: "$0 (1K)",
    popular: "$50/10K",
    enterprise: "$400/100K", 
    model: "Pay-per-email",
    limitedOffer: null,
    highlight: false,
    website: "https://www.neverbounce.com/pricing",
    note: "Credits expire in 12 months"
  },
  { 
    name: "Hunter.io", 
    free: "$0 (50)",
    popular: "$149/mo",
    enterprise: "$299/mo", 
    model: "Credit-based",
    limitedOffer: null,
    highlight: false,
    website: "https://hunter.io/pricing",
    note: "10K credits/mo limit"
  },
  { 
    name: "Clearout", 
    free: "$0 (100)",
    popular: "$58/mo",
    enterprise: "$174/mo", 
    model: "Credit-based",
    limitedOffer: null,
    highlight: false,
    website: "https://clearout.io/pricing/",
    note: "Monthly credit limits"
  },
  { 
    name: "EmailListVerify", 
    free: "$0 (100)",
    popular: "$27/10K",
    enterprise: "$186/100K", 
    model: "Pay-per-email",
    limitedOffer: null,
    highlight: false,
    website: "https://www.emaillistverify.com/pricing/",
    note: "One-time credit purchase"
  },
];

export const PricingComparisonSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-cyan mb-4">Pricing Comparison</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Only MailVet Offers <span className="gradient-text">Unlimited Verifications</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            While competitors charge per email or cap your monthly verifications, 
            MailVet gives you <strong className="text-primary">truly unlimited</strong> email verifications 
            at one low monthly price.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[800px] max-w-5xl mx-auto">
            {/* Header */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              <div className="p-4 text-left">
                <span className="text-sm text-muted-foreground">Provider</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Free Tier</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Popular Plan</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Enterprise</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Pricing Model</span>
              </div>
              <div className="p-4"></div>
            </div>

            {/* Rows */}
            {pricingData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`grid grid-cols-6 gap-3 mb-3 p-4 rounded-xl ${
                  item.highlight 
                    ? 'bg-gradient-to-r from-primary/15 via-purple-500/10 to-pink-500/10 border-2 border-primary' 
                    : 'bg-card/50 border border-border/30'
                }`}
              >
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    {item.highlight && <Star className="w-4 h-4 text-primary fill-primary" />}
                    <span className={`font-bold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                      {item.name}
                    </span>
                    {item.website && (
                      <a 
                        href={item.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={`Visit ${item.name} pricing page`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{item.note}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.free}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${item.highlight ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                      {item.popular}
                    </span>
                  </div>
                  {item.limitedOffer && (
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-1">
                      <Flame className="w-3 h-3" />
                      {item.limitedOffer}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.enterprise}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`text-sm font-medium flex items-center gap-1 ${item.model === 'Unlimited' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.model === 'Unlimited' && <Infinity className="w-4 h-4" />}
                    {item.model}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  {item.highlight && (
                    <Link to="/access?page=signup">
                      <Button size="sm" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Get Started
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs text-muted-foreground text-center mt-6"
        >
          Prices sourced from official websites as of December 2024. Competitor prices vary based on usage. 
          Links open competitor pricing pages for verification.
        </motion.p>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Infinity className="w-10 h-10 text-primary" />
            </div>
            <p className="text-foreground font-semibold">Unlimited Verifications</p>
            <p className="text-sm text-muted-foreground mt-1">No caps, no limits, ever</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-8 h-8 text-amber-400" />
              <span className="text-3xl font-bold text-amber-400">90%</span>
            </div>
            <p className="text-foreground font-semibold">Limited Time Discount</p>
            <p className="text-sm text-muted-foreground mt-1">$29.99/mo instead of $299</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-foreground font-semibold">No Per-Email Charges</p>
            <p className="text-sm text-muted-foreground mt-1">Flat rate, simple pricing</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
