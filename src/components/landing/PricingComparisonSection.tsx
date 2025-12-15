import { motion } from "framer-motion";
import { Check, Star, ExternalLink, Flame, Infinity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pricingData = [
  { name: "MailVet", free: "$0 (100)", popular: "$29.99/mo", enterprise: "Custom", model: "Unlimited", limitedOffer: "90% OFF", highlight: true, website: null, note: "Unlimited verifications on all paid plans" },
  { name: "ZeroBounce", free: "$0 (100)", popular: "$99/mo", enterprise: "$499/mo+", model: "Credit-based", limitedOffer: null, highlight: false, website: "https://www.zerobounce.net/email-validation-pricing", note: "Monthly credit limits apply" },
  { name: "NeverBounce", free: "$0 (1K)", popular: "$50/10K", enterprise: "$400/100K", model: "Pay-per-email", limitedOffer: null, highlight: false, website: "https://www.neverbounce.com/pricing", note: "Credits expire in 12 months" },
  { name: "Hunter.io", free: "$0 (50)", popular: "$149/mo", enterprise: "$299/mo", model: "Credit-based", limitedOffer: null, highlight: false, website: "https://hunter.io/pricing", note: "10K credits/mo limit" },
  { name: "Clearout", free: "$0 (100)", popular: "$58/mo", enterprise: "$174/mo", model: "Credit-based", limitedOffer: null, highlight: false, website: "https://clearout.io/pricing/", note: "Monthly credit limits" },
  { name: "EmailListVerify", free: "$0 (100)", popular: "$27/10K", enterprise: "$186/100K", model: "Pay-per-email", limitedOffer: null, highlight: false, website: "https://www.emaillistverify.com/pricing/", note: "One-time credit purchase" },
];

export const PricingComparisonSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(270,50%,5%)]" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[hsl(152,76%,45%)] rounded-full blur-[200px] opacity-8" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-[hsl(267,100%,60%)] mb-4">Pricing Comparison</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            <span className="text-white">Only MailVet Offers </span>
            <span className="marketing-gradient-text">Unlimited Verifications</span>
          </h2>
          <p className="text-lg text-[hsl(270,20%,70%)] max-w-3xl mx-auto">
            While competitors charge per email or cap your monthly verifications, 
            MailVet gives you <strong className="text-[hsl(267,100%,60%)]">truly unlimited</strong> email verifications at one low monthly price.
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
              <div className="p-4 text-left"><span className="text-sm text-[hsl(270,20%,65%)]">Provider</span></div>
              <div className="p-4 text-center"><span className="text-sm text-[hsl(270,20%,65%)]">Free Tier</span></div>
              <div className="p-4 text-center"><span className="text-sm text-[hsl(270,20%,65%)]">Popular Plan</span></div>
              <div className="p-4 text-center"><span className="text-sm text-[hsl(270,20%,65%)]">Enterprise</span></div>
              <div className="p-4 text-center"><span className="text-sm text-[hsl(270,20%,65%)]">Pricing Model</span></div>
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
                    ? 'bg-gradient-to-r from-[hsl(267,100%,60%)/0.15] via-[hsl(269,100%,53%)/0.1] to-[hsl(212,93%,52%)/0.1] border-2 border-[hsl(267,100%,60%)]' 
                    : 'bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]'
                }`}
              >
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    {item.highlight && <Star className="w-4 h-4 text-[hsl(267,100%,60%)] fill-[hsl(267,100%,60%)]" />}
                    <span className={`font-bold ${item.highlight ? 'text-[hsl(267,100%,60%)]' : 'text-white'}`}>{item.name}</span>
                    {item.website && (
                      <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-[hsl(270,20%,60%)] hover:text-[hsl(267,100%,60%)] transition-colors">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-[hsl(270,20%,60%)] mt-1">{item.note}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-white' : 'text-[hsl(270,20%,65%)]'}`}>{item.free}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-[hsl(152,76%,45%)]' : 'text-[hsl(270,20%,65%)]'}`}>{item.popular}</span>
                  {item.limitedOffer && (
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-1">
                      <Flame className="w-3 h-3" />{item.limitedOffer}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <span className={`font-semibold ${item.highlight ? 'text-white' : 'text-[hsl(270,20%,65%)]'}`}>{item.enterprise}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className={`text-sm font-medium flex items-center gap-1 ${item.model === 'Unlimited' ? 'text-[hsl(267,100%,60%)]' : 'text-[hsl(270,20%,65%)]'}`}>
                    {item.model === 'Unlimited' && <Infinity className="w-4 h-4" />}{item.model}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  {item.highlight && (
                    <Link to="/access?page=signup">
                      <Button size="sm" className="text-xs marketing-cta text-white rounded-full">Get Started</Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[hsl(267,100%,60%)/0.1] to-[hsl(269,100%,53%)/0.1] border border-[hsl(267,100%,60%)/0.3]">
            <Infinity className="w-10 h-10 text-[hsl(267,100%,60%)] mx-auto mb-2" />
            <p className="text-white font-semibold">Unlimited Verifications</p>
            <p className="text-sm text-[hsl(270,20%,65%)] mt-1">No caps, no limits, ever</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-8 h-8 text-amber-400" />
              <span className="text-3xl font-bold text-amber-400">90%</span>
            </div>
            <p className="text-white font-semibold">Limited Time Discount</p>
            <p className="text-sm text-[hsl(270,20%,65%)] mt-1">$29.99/mo instead of $299</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
            <Check className="w-8 h-8 text-[hsl(152,76%,45%)] mx-auto mb-2" />
            <p className="text-white font-semibold">No Per-Email Charges</p>
            <p className="text-sm text-[hsl(270,20%,65%)] mt-1">Flat rate, simple pricing</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
