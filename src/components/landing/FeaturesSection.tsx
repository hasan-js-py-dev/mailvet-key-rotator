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
    description: "Verify individual emails instantly with our lightning-fast API. Get detailed results including validity, domain info, and risk assessment.",
  },
  {
    icon: FileSpreadsheet,
    title: "Bulk List Validation",
    description: "Upload CSV files with thousands of emails and let us validate them in parallel. Download clean lists when processing is complete.",
  },
  {
    icon: Zap,
    title: "High-Speed Processing",
    description: "From 1 to 10 emails per second based on your plan. Scale your validation speed as your business grows.",
  },
  {
    icon: Shield,
    title: "99.9% Accuracy",
    description: "Our multi-layer verification checks MX records, SMTP responses, and catch-all detection for maximum precision.",
  },
  {
    icon: Code,
    title: "Developer-Friendly API",
    description: "Simple REST API with comprehensive documentation. Integrate email validation into your app in minutes.",
  },
  {
    icon: Gift,
    title: "Free Trial Credits",
    description: "Start with 50 free credits to test our service. No credit card required to begin validating emails.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Validate Emails</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you maintain a clean email list and improve deliverability.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="gradient-border h-full">
                <div className="bg-card h-full p-8 rounded-lg hover:bg-muted/50 transition-colors duration-300">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
