import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does MailVet's email verification work?",
    answer: "MailVet uses a multi-layer verification process that includes syntax validation, DNS/MX record checks, SMTP handshake verification, disposable email detection, and spam trap identification. This comprehensive approach achieves 99% accuracy in determining if an email address is valid and deliverable."
  },
  {
    question: "What's included in the 100 free credits?",
    answer: "When you sign up, you get 100 free email verifications with full access to all features including real-time API verification, bulk list upload, disposable email detection, and detailed verification reports. No credit card required to start."
  },
  {
    question: "How is pricing calculated?",
    answer: "You only pay for what you use. Credits are purchased in packages—the more you buy, the lower the cost per verification. Our Starter plan offers 1,000 credits for $4, Professional offers 10,000 for $15, and Business offers 100,000 for $89. Credits never expire."
  },
  {
    question: "Do credits expire?",
    answer: "No, your credits never expire. Once purchased, they remain in your account until used. This is different from many competitors who expire credits after 12 months."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "MailVet uses a pay-as-you-go model, not subscriptions. You purchase credits when needed and use them at your own pace. There's nothing to cancel—no recurring charges unless you set up auto-refill."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise customers. All payments are securely processed through Stripe."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service for any reason, contact support within 30 days of purchase for a full refund on unused credits."
  },
  {
    question: "What's the difference between real-time and bulk verification?",
    answer: "Real-time verification checks emails instantly as users enter them (great for signup forms). Bulk verification lets you upload a list of emails (CSV/Excel) and verify them all at once—ideal for cleaning existing databases or marketing lists."
  },
  {
    question: "Is MailVet GDPR compliant?",
    answer: "Yes, MailVet is fully GDPR compliant. We never store the email addresses you verify—data is processed in real-time and immediately discarded. Our infrastructure is SOC 2 Type II certified and follows strict data protection protocols."
  },
  {
    question: "Do you offer enterprise plans?",
    answer: "Yes, we offer custom enterprise plans for businesses verifying 1M+ emails per month. Enterprise plans include dedicated support, custom SLAs, volume discounts, and optional on-premise deployment. Contact our sales team for details."
  },
  {
    question: "How accurate is MailVet compared to competitors?",
    answer: "MailVet achieves 99.2% accuracy, ranking #1 in independent benchmarks against major competitors including ZeroBounce (98.8%), NeverBounce (98.5%), and Hunter.io (97.2%). Our multi-layer verification process catches issues others miss."
  },
  {
    question: "What happens if I run out of credits?",
    answer: "API calls will return an 'insufficient credits' error. You can purchase more credits anytime, or enable auto-refill to automatically add credits when your balance drops below a threshold you set."
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[150px] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-cyan mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about MailVet's email verification service, 
            pricing, and features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/30 rounded-xl px-6 bg-card/50 data-[state=open]:bg-card/80 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-foreground font-semibold pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <a 
            href="mailto:support@mailvet.app" 
            className="text-primary hover:underline font-semibold"
          >
            Contact Support →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
