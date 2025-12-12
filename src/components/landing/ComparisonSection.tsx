import { motion } from "framer-motion";
import { Check, X, Minus, ExternalLink } from "lucide-react";

const competitors = [
  { name: "MailVet", highlight: true, website: null },
  { name: "ZeroBounce", highlight: false, website: "https://www.zerobounce.net" },
  { name: "NeverBounce", highlight: false, website: "https://www.neverbounce.com" },
  { name: "Hunter.io", highlight: false, website: "https://hunter.io" },
  { name: "Clearout", highlight: false, website: "https://clearout.io" },
  { name: "EmailListVerify", highlight: false, website: "https://www.emaillistverify.com" },
];

const features = [
  { 
    feature: "Real-time API Verification", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: true, clearout: true, emaillistverify: true 
  },
  { 
    feature: "Bulk List Verification", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: true, clearout: true, emaillistverify: true 
  },
  { 
    feature: "SMTP Verification", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: "partial", clearout: true, emaillistverify: true 
  },
  { 
    feature: "Disposable Email Detection", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: true, clearout: true, emaillistverify: true 
  },
  { 
    feature: "Catch-All Detection", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: "partial", clearout: true, emaillistverify: true 
  },
  { 
    feature: "Spam Trap Detection", 
    mailvet: true, zerobounce: true, neverbounce: "partial", hunter: false, clearout: true, emaillistverify: "partial" 
  },
  { 
    feature: "Role-Based Email Detection", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: true, clearout: true, emaillistverify: true 
  },
  { 
    feature: "Unlimited Verifications", 
    mailvet: true, zerobounce: false, neverbounce: false, hunter: false, clearout: false, emaillistverify: false 
  },
  { 
    feature: "Free Credits", 
    mailvet: "100", zerobounce: "100", neverbounce: "1,000", hunter: "50", clearout: "100", emaillistverify: "100" 
  },
  { 
    feature: "Credits Never Expire", 
    mailvet: true, zerobounce: true, neverbounce: false, hunter: false, clearout: "partial", emaillistverify: true 
  },
  { 
    feature: "GDPR Compliant", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: true, clearout: true, emaillistverify: true 
  },
  { 
    feature: "SOC 2 Type II Certified", 
    mailvet: true, zerobounce: true, neverbounce: true, hunter: false, clearout: false, emaillistverify: false 
  },
  { 
    feature: "Zero Data Retention", 
    mailvet: true, zerobounce: false, neverbounce: false, hunter: false, clearout: false, emaillistverify: false 
  },
  { 
    feature: "24/7 Priority Support", 
    mailvet: true, zerobounce: true, neverbounce: "partial", hunter: "partial", clearout: "partial", emaillistverify: false 
  },
];

const getIcon = (value: boolean | string) => {
  if (value === true) return <Check className="w-5 h-5 text-emerald-400" />;
  if (value === false) return <X className="w-5 h-5 text-rose-400" />;
  if (value === "partial") return <Minus className="w-5 h-5 text-amber-400" />;
  return <span className="text-sm font-semibold text-foreground">{value}</span>;
};

export const ComparisonSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-cyan mb-4">Feature Comparison</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            See How <span className="gradient-text">MailVet Compares</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compare MailVet with leading email verification tools. We're the only provider 
            offering <strong className="text-foreground">unlimited verifications</strong> with enterprise-grade features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[900px]">
            {/* Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="p-4"></div>
              {competitors.map((comp) => (
                <div 
                  key={comp.name}
                  className={`p-4 rounded-xl text-center ${
                    comp.highlight 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'bg-card/50 border border-border/30'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className={`font-bold text-sm ${comp.highlight ? 'text-primary' : 'text-foreground'}`}>
                      {comp.name}
                    </span>
                    {comp.website && (
                      <a 
                        href={comp.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={`Visit ${comp.name}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {comp.highlight && (
                    <span className="block text-xs text-primary mt-1">Recommended</span>
                  )}
                </div>
              ))}
            </div>

            {/* Features */}
            {features.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="grid grid-cols-7 gap-2 mb-2"
              >
                <div className="p-4 bg-card/30 rounded-lg flex items-center">
                  <span className="text-sm text-foreground font-medium">{row.feature}</span>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                  {getIcon(row.mailvet)}
                </div>
                <div className="p-4 bg-card/30 rounded-lg flex items-center justify-center">
                  {getIcon(row.zerobounce)}
                </div>
                <div className="p-4 bg-card/30 rounded-lg flex items-center justify-center">
                  {getIcon(row.neverbounce)}
                </div>
                <div className="p-4 bg-card/30 rounded-lg flex items-center justify-center">
                  {getIcon(row.hunter)}
                </div>
                <div className="p-4 bg-card/30 rounded-lg flex items-center justify-center">
                  {getIcon(row.clearout)}
                </div>
                <div className="p-4 bg-card/30 rounded-lg flex items-center justify-center">
                  {getIcon(row.emaillistverify)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Full Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-amber-400" />
            <span>Partial/Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-rose-400" />
            <span>Not Available</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xs text-muted-foreground text-center mt-6"
        >
          Feature comparison based on publicly available information as of December 2024. 
          Click provider names to visit their websites for verification.
        </motion.p>
      </div>
    </section>
  );
};
