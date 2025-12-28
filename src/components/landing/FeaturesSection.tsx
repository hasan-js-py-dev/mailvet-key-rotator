import { motion } from "framer-motion";
import { Mail, FileSpreadsheet, Zap, Shield, Code, Gift, Globe, Lock } from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Real-Time Email Validation",
    description: "Verify individual email addresses instantly with our lightning-fast API. Get detailed validity results in milliseconds, not minutes.",
  },
  {
    icon: FileSpreadsheet,
    title: "Bulk List Validation",
    description: "Upload CSV files containing thousands of emails. Download clean, validated lists with detailed reports when processing completes.",
  },
  {
    icon: Zap,
    title: "High-Speed Processing",
    description: "Validate from 1 to 10 emails per second based on your plan. Enterprise-grade infrastructure that scales with your business needs.",
  },
  {
    icon: Shield,
    title: "99% Accuracy Guaranteed",
    description: "Multi-layer verification including SMTP checks, MX record validation, catch-all detection, and disposable email identification.",
  },
  {
    icon: Code,
    title: "Developer-Friendly API",
    description: "RESTful API with comprehensive documentation. Integrate email validation into your applications in minutes with our SDKs.",
  },
  {
    icon: Gift,
    title: "100 Free Credits to Start",
    description: "Test our service risk-free with 100 complimentary credits. No credit card required to get started immediately.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Validate emails from any domain worldwide. Our distributed infrastructure ensures fast response times globally.",
  },
  {
    icon: Lock,
    title: "GDPR & Privacy Compliant",
    description: "We never store validated email addresses. Your data is processed securely and deleted immediately after validation.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[hsl(270,50%,4%)]" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[hsl(267,100%,50%)] rounded-full blur-[200px] opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-[hsl(267,100%,60%)] mb-4">Features</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            <span className="text-white">Everything You Need to </span>
            <span className="marketing-gradient-text">Validate Emails</span>
          </h2>
          <p className="text-lg text-[hsl(270,20%,70%)] max-w-2xl mx-auto">
            Powerful email validation features designed to maintain clean email lists, 
            improve deliverability rates, and protect your sender reputation.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)] hover:border-[hsl(267,100%,60%)/0.4] hover:bg-[hsl(270,50%,8%)] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-[hsl(267,100%,60%)/0.1] border border-[hsl(267,100%,60%)/0.2] flex items-center justify-center mb-5 group-hover:bg-[hsl(267,100%,60%)/0.15] transition-colors">
                  <feature.icon className="w-5 h-5 text-[hsl(267,100%,60%)]" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-[hsl(270,20%,65%)] text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
