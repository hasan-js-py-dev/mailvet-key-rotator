import { motion } from "framer-motion";
import { 
  Upload, 
  Zap, 
  Download,
  ArrowRight 
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your List",
    description: "Simply upload your email list in CSV format or use our API to validate emails in real-time. Supports lists of any size.",
  },
  {
    step: "02",
    icon: Zap,
    title: "Instant Verification",
    description: "Our advanced algorithms verify each email address using SMTP checks, MX record validation, and catch-all detection.",
  },
  {
    step: "03",
    icon: Download,
    title: "Download Clean Data",
    description: "Get your validated list with detailed results. Remove invalid, risky, and disposable emails to maximize deliverability.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-cyan mb-4">How It Works</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Email Validation Made{" "}
            <span className="gradient-text">Simple</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clean your email lists in three easy steps. No technical expertise required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              )}
              
              <div className="relative p-8 rounded-2xl border border-border/30 bg-card/30 hover:border-cyan/30 hover:bg-card/50 transition-all duration-300">
                {/* Step number */}
                <span className="absolute -top-4 left-6 text-5xl font-bold text-cyan/20 group-hover:text-cyan/30 transition-colors">
                  {item.step}
                </span>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition-colors">
                  <item.icon className="w-7 h-7 text-cyan" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};