import { motion } from "framer-motion";
import { Check, Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pricingData = [
  { 
    name: "MailVet", 
    price10k: "$15",
    price50k: "$49",
    price100k: "$89", 
    priceType: "Unlimited",
    freeCredits: "100",
    creditExpiry: "Never",
    highlight: true,
    website: null,
    note: "Unlimited verifications"
  },
  { 
    name: "ZeroBounce", 
    price10k: "~$99*",
    price50k: "~$99*",
    price100k: "~$99*", 
    priceType: "Subscription",
    freeCredits: "100",
    creditExpiry: "Never",
    highlight: false,
    website: "https://www.zerobounce.net/email-validation-pricing",
    note: "*Min 25K credits subscription"
  },
  { 
    name: "NeverBounce", 
    price10k: "$50",
    price50k: "$250",
    price100k: "$400", 
    priceType: "Pay-as-you-go",
    freeCredits: "1,000",
    creditExpiry: "12 months",
    highlight: false,
    website: "https://www.neverbounce.com/pricing",
    note: "$0.004-$0.008/credit"
  },
  { 
    name: "Hunter.io", 
    price10k: "$149/mo",
    price50k: "$299/mo",
    price100k: "$299/mo", 
    priceType: "Subscription",
    freeCredits: "50",
    creditExpiry: "Monthly",
    highlight: false,
    website: "https://hunter.io/pricing",
    note: "Includes email finder"
  },
  { 
    name: "Clearout", 
    price10k: "$48/mo",
    price50k: "$144/mo",
    price100k: "$264/mo", 
    priceType: "Subscription",
    freeCredits: "100",
    creditExpiry: "Rollover",
    highlight: false,
    website: "https://clearout.io/pricing/",
    note: "Monthly subscription"
  },
  { 
    name: "EmailListVerify", 
    price10k: "$27",
    price50k: "$98",
    price100k: "$186", 
    priceType: "Pay-as-you-go",
    freeCredits: "100",
    creditExpiry: "Never",
    highlight: false,
    website: "https://www.emaillistverify.com/pricing/",
    note: "$0.00186-$0.005/credit"
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
            Best Value: <span className="gradient-text">Unlimited Email Verification</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            While competitors charge per-email, MailVet offers <strong className="text-foreground">unlimited verifications</strong> at 
            fixed monthly prices. Verify as many emails as you need without worrying about costs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[900px] max-w-6xl mx-auto">
            {/* Header */}
            <div className="grid grid-cols-7 gap-3 mb-4">
              <div className="p-4 text-left">
                <span className="text-sm text-muted-foreground">Provider</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">10K emails</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">50K emails</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">100K emails</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Free Credits</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Credit Expiry</span>
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
                className={`grid grid-cols-7 gap-3 mb-3 p-4 rounded-xl ${
                  item.highlight 
                    ? 'bg-primary/15 border-2 border-primary' 
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
                  <span className={`font-semibold ${item.highlight ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {item.price10k}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {item.price50k}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {item.price100k}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`text-sm ${item.highlight ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                    {item.freeCredits}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`text-sm ${item.creditExpiry === 'Never' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {item.creditExpiry}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  {item.highlight && (
                    <Link to="/access?page=signup">
                      <Button size="sm" className="text-xs">
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
          Prices sourced from official websites as of December 2024. Actual prices may vary. 
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
          <div className="text-center p-6 rounded-2xl bg-primary/10 border border-primary/30">
            <div className="text-4xl font-bold text-primary mb-2">Unlimited</div>
            <p className="text-muted-foreground">Verifications per plan</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <div className="text-4xl font-bold gradient-text mb-2">No</div>
            <p className="text-muted-foreground">Per-email charges</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="w-8 h-8 text-emerald-400" />
              <span className="text-4xl font-bold gradient-text">Never</span>
            </div>
            <p className="text-muted-foreground">Credits expire</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
