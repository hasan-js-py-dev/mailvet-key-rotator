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
    quote: "Finally, an email validation service that's both accurate and affordable. The 100 free credits let us test thoroughly.",
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
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-accent mb-4">Testimonials</p>
          <h2 className="font-display font-bold mb-5">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join businesses worldwide who trust MailVet for their email validation needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-7 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 text-base leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.author}</p>
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
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {badges.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-3 px-5 py-3 rounded-full border border-border/50 bg-card/50"
            >
              <badge.icon className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
