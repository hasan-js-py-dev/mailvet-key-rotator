import { motion } from "framer-motion";
import { Star, Shield, CreditCard } from "lucide-react";

const testimonials = [
  {
    quote: "MailVet reduced our bounce rate by 60% in the first month. Our email deliverability has never been better!",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechFlow Inc.",
  },
  {
    quote: "The API is incredibly easy to integrate. We had it running in production within an hour. Fantastic developer experience.",
    author: "Ahmed Hassan",
    role: "Lead Developer",
    company: "StartupHub",
  },
  {
    quote: "Finally, an email validation service that's both accurate and affordable. The 50 free credits let us test thoroughly.",
    author: "Maria Garcia",
    role: "Email Operations",
    company: "GrowthMail",
  },
];

const badges = [
  { icon: Shield, text: "GDPR Compliant" },
  { icon: CreditCard, text: "Secure Payments via Dodo" },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join businesses worldwide who trust MailVet for their email validation needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {badges.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border"
            >
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="font-medium">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
