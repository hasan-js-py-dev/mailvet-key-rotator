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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(270,50%,6%)/0.3] to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-[hsl(270,20%,65%)] uppercase tracking-wider">
            Trusted by 10,000+ businesses worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[hsl(270,50%,8%)] border border-[hsl(270,50%,15%)] hover:border-[hsl(267,100%,60%)/0.3] transition-colors"
            >
              <badge.icon className="w-5 h-5 text-[hsl(267,100%,60%)]" />
              <div>
                <p className="font-bold text-white text-sm">{badge.label}</p>
                <p className="text-xs text-[hsl(270,20%,60%)]">{badge.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
