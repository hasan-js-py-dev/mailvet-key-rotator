import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pricingData = [
  { 
    name: "MailVet", 
    price1k: "$4", 
    price10k: "$15", 
    price100k: "$89", 
    pricePerEmail: "$0.00089",
    highlight: true,
    savings: "Save up to 40%"
  },
  { 
    name: "ZeroBounce", 
    price1k: "$16", 
    price10k: "$39", 
    price100k: "$190",
    pricePerEmail: "$0.0019",
    highlight: false,
    savings: null
  },
  { 
    name: "NeverBounce", 
    price1k: "$8", 
    price10k: "$30", 
    price100k: "$150",
    pricePerEmail: "$0.0015",
    highlight: false,
    savings: null
  },
  { 
    name: "Hunter.io", 
    price1k: "$49*", 
    price10k: "$99*", 
    price100k: "$399*",
    pricePerEmail: "$0.004",
    highlight: false,
    savings: null
  },
  { 
    name: "Clearout", 
    price1k: "$7", 
    price10k: "$28", 
    price100k: "$140",
    pricePerEmail: "$0.0014",
    highlight: false,
    savings: null
  },
  { 
    name: "EmailListVerify", 
    price1k: "$4", 
    price10k: "$19", 
    price100k: "$109",
    pricePerEmail: "$0.00109",
    highlight: false,
    savings: null
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
            Best Value in <span className="gradient-text">Email Verification</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get enterprise-grade accuracy at startup-friendly prices. 
            MailVet offers the best price-to-performance ratio in the market.
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
                <span className="text-sm text-muted-foreground">1,000 emails</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">10,000 emails</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">100,000 emails</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm text-muted-foreground">Per Email</span>
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
                    ? 'bg-primary/15 border-2 border-primary' 
                    : 'bg-card/50 border border-border/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.highlight && <Star className="w-5 h-5 text-primary fill-primary" />}
                  <div>
                    <span className={`font-bold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                      {item.name}
                    </span>
                    {item.savings && (
                      <span className="block text-xs text-emerald-400 font-medium">{item.savings}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.price1k}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.price10k}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.price100k}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`text-sm ${item.highlight ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                    {item.pricePerEmail}
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
          *Hunter.io prices include email finder features. Prices as of 2024. Subject to change.
        </motion.p>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <div className="text-4xl font-bold gradient-text mb-2">40%</div>
            <p className="text-muted-foreground">Average savings vs competitors</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <div className="text-4xl font-bold gradient-text mb-2">No</div>
            <p className="text-muted-foreground">Hidden fees or setup costs</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30">
            <div className="text-4xl font-bold gradient-text mb-2">∞</div>
            <p className="text-muted-foreground">Credits never expire</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
