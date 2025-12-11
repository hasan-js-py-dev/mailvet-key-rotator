import { motion } from "framer-motion";
import { 
  Mail, 
  FileSpreadsheet, 
  Zap, 
  Shield, 
  Code, 
  Gift 
} from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Real-Time Validation",
    description: "Verify individual emails instantly with our lightning-fast API. Get detailed validity results in milliseconds.",
  },
  {
    icon: FileSpreadsheet,
    title: "Bulk List Validation",
    description: "Upload CSV files with thousands of emails. Download clean, validated lists when processing completes.",
  },
  {
    icon: Zap,
    title: "High-Speed Processing",
    description: "From 1 to 10 emails per second based on your plan. Scale your validation as your business grows.",
  },
  {
    icon: Shield,
    title: "99.9% Accuracy",
    description: "Multi-layer verification checks MX records, SMTP responses, and catch-all detection for precision.",
  },
  {
    icon: Code,
    title: "Developer-Friendly API",
    description: "Simple REST API with comprehensive documentation. Integrate email validation in minutes.",
  },
  {
    icon: Gift,
    title: "Free Trial Credits",
    description: "Start with 50 free credits to test our service. No credit card required to begin.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Background elements */}
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
          <p className="text-overline text-accent mb-4">Features</p>
          <h2 className="font-display font-bold mb-5">
            Everything You Need to{" "}
            <span className="gradient-text">Validate Emails</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to maintain a clean email list and improve your deliverability rates.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-300">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
