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
    question: "What's included in the free plan?",
    answer: "The free plan includes 100 email verifications to test our service. You can validate single emails and see how MailVet works. No credit card required. When you're ready for unlimited verifications, upgrade to our Ultimate plan."
  },
  {
    question: "What does 'unlimited verifications' mean?",
    answer: "With our Ultimate plan at $29.99/month (90% off from $299), you get truly unlimited email verifications. There are no per-email charges, no monthly caps, and no hidden fees. Verify 1,000 or 1,000,000 emails—your price stays the same. This is unique to MailVet; competitors typically charge $0.001-$0.01 per email."
  },
  {
    question: "Why is there a 90% discount right now?",
    answer: "We're offering a limited-time launch discount to help businesses discover the power of unlimited email verification. Lock in $29.99/month now before prices return to $299/month. This offer won't last forever!"
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your MailVet subscription at any time with no cancellation fees. Your access continues until the end of your current billing period. We believe in earning your business every month, not locking you in with contracts."
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
    answer: "Real-time verification checks emails instantly as users enter them (great for signup forms, checkout pages). Bulk verification lets you upload CSV files with up to 10,000 rows and verify them all at once—ideal for cleaning existing databases or marketing lists. Both are included with unlimited usage in the Ultimate plan."
  },
  {
    question: "Is MailVet GDPR compliant?",
    answer: "Yes, MailVet is fully GDPR compliant. We never store the email addresses you verify—data is processed in real-time and immediately discarded. Our infrastructure is SOC 2 Type II certified and follows strict data protection protocols."
  },
  {
    question: "What's included in the Enterprise plan?",
    answer: "Enterprise includes everything in Ultimate plus: full API access, super-fast processing, unlimited concurrent file uploads, a dedicated account manager, custom integrations, and SLA guarantees. Contact our sales team for custom pricing based on your needs."
  },
  {
    question: "How accurate is MailVet compared to competitors?",
    answer: "MailVet achieves 99.2% accuracy, ranking #1 in independent benchmarks against major competitors including ZeroBounce (99.0%), NeverBounce (98.5%), and Hunter.io (97.2%). Our multi-layer verification process catches issues that single-check verifiers miss."
  },
  {
    question: "Are there any rate limits?",
    answer: "The Ultimate plan includes 3 emails/second verification rate and up to 2 concurrent file uploads with max 10,000 rows per file. For higher throughput and unlimited concurrent files, our Enterprise plan offers super-fast processing tailored to your needs."
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
