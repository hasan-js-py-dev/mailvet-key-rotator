import { motion } from "framer-motion";
import { 
  Mail, 
  ShoppingCart, 
  Code2, 
  Building2,
  Megaphone,
  Users
} from "lucide-react";

const useCases = [
  {
    icon: Megaphone,
    title: "Email Marketers",
    description: "Clean your mailing lists before campaigns to improve deliverability, reduce bounces, and increase open rates. Protect your sender reputation.",
    benefits: ["Higher open rates", "Better inbox placement", "Reduced spam complaints"],
  },
  {
    icon: Code2,
    title: "Developers & SaaS",
    description: "Integrate email validation into your signup forms and user registration flows. Prevent fake accounts and ensure data quality from day one.",
    benefits: ["Real-time API validation", "Easy integration", "Webhook support"],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    description: "Validate customer emails at checkout to ensure order confirmations and shipping updates reach your customers every time.",
    benefits: ["Reduced cart abandonment", "Better customer communication", "Fewer failed deliveries"],
  },
  {
    icon: Building2,
    title: "Enterprises",
    description: "Maintain clean databases at scale with bulk validation. Ensure compliance and protect your brand's email reputation across all departments.",
    benefits: ["GDPR compliance", "Bulk processing", "Custom SLAs"],
  },
  {
    icon: Users,
    title: "Lead Generation",
    description: "Verify leads before they enter your CRM. Save time and resources by focusing on real prospects with valid contact information.",
    benefits: ["Higher conversion rates", "Cleaner CRM data", "Better ROI"],
  },
  {
    icon: Mail,
    title: "Email Service Providers",
    description: "Offer email validation as a value-add to your customers. White-label our API or use it to protect your platform's reputation.",
    benefits: ["White-label ready", "High volume capacity", "Priority support"],
  },
];

export const UseCasesSection = () => {
  return (
    <section id="use-cases" className="relative py-24 overflow-hidden">
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
          <p className="text-overline text-cyan mb-4">Use Cases</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Email Validation for{" "}
            <span className="gradient-text">Every Business</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From startups to enterprises, MailVet helps businesses maintain clean email lists and improve communication.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-7 rounded-2xl border border-border/30 bg-card/30 hover:border-cyan/30 hover:bg-card/60 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-5 group-hover:bg-cyan/20 transition-colors">
                  <useCase.icon className="w-6 h-6 text-cyan" />
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-foreground">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{useCase.description}</p>
                
                <div className="space-y-2">
                  {useCase.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      <span className="text-foreground/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};