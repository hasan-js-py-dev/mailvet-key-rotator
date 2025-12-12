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
    question: "What's included in the 100 free trial verifications?",
    answer: "When you sign up, you get 100 free email verifications to test our service. This includes full access to real-time API verification, bulk list upload, disposable email detection, and detailed verification reports. No credit card required to start."
  },
  {
    question: "How is MailVet's pricing different from competitors?",
    answer: "Unlike competitors who charge per email or limit your monthly verifications, MailVet offers truly unlimited email verifications at flat monthly rates. Our Starter plan is $15/month, Professional is $49/month, and Business is $89/month—all with unlimited verifications. No surprises, no overage charges."
  },
  {
    question: "What does 'unlimited verifications' mean?",
    answer: "Unlimited means exactly that—you can verify as many emails as you need without any per-email charges or monthly caps. Whether you verify 1,000 or 1,000,000 emails per month, your price stays the same. This is unique to MailVet; competitors typically charge $0.001-$0.01 per email."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your MailVet subscription at any time with no cancellation fees. Your access continues until the end of your current billing period. We believe in earning your business every month, not locking you in."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise customers. All payments are securely processed through Stripe with bank-level encryption."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with MailVet for any reason, contact support within 30 days of your first payment for a full refund. No questions asked."
  },
  {
    question: "What's the difference between real-time and bulk verification?",
    answer: "Real-time verification checks emails instantly as users enter them (great for signup forms, checkout pages). Bulk verification lets you upload a list of emails (CSV/Excel) and verify them all at once—ideal for cleaning existing databases or marketing lists. Both are included in all plans with unlimited usage."
  },
  {
    question: "Is MailVet GDPR compliant?",
    answer: "Yes, MailVet is fully GDPR compliant. We never store the email addresses you verify—data is processed in real-time and immediately discarded. Our infrastructure is SOC 2 Type II certified and follows strict data protection protocols."
  },
  {
    question: "Do you offer enterprise or custom plans?",
    answer: "Yes, we offer custom enterprise plans for large organizations with specific requirements. Enterprise plans include dedicated support, custom SLAs, priority API access, and optional on-premise deployment. Contact our sales team for a custom quote."
  },
  {
    question: "How accurate is MailVet compared to competitors?",
    answer: "MailVet achieves 99.2% accuracy, ranking #1 in independent benchmarks against major competitors including ZeroBounce (99.0%), NeverBounce (98.5%), and Hunter.io (97.2%). Our multi-layer verification process catches issues that single-check verifiers miss."
  },
  {
    question: "What happens if I need to upgrade or downgrade my plan?",
    answer: "You can upgrade or downgrade your plan at any time from your dashboard. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle. All plans include unlimited verifications, so you're choosing based on features and support level."
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
            Everything you need to know about MailVet's unlimited email verification service.
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
