import { motion } from "framer-motion";
import { Shield, Lock, Award, Globe, Zap, Users } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2 Type II", sublabel: "Certified" },
  { icon: Lock, label: "GDPR", sublabel: "Compliant" },
  { icon: Award, label: "99.99%", sublabel: "Uptime SLA" },
  { icon: Globe, label: "Global CDN", sublabel: "Distributed" },
  { icon: Zap, label: "200ms", sublabel: "Avg Response" },
  { icon: Users, label: "10K+", sublabel: "Customers" },
];

export const TrustBadgesSection = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            Trusted by 10,000+ businesses worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/30 border border-border/20"
            >
              <badge.icon className="w-6 h-6 text-cyan" />
              <div>
                <p className="font-bold text-foreground text-sm">{badge.label}</p>
                <p className="text-xs text-muted-foreground">{badge.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
