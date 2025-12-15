import { motion } from "framer-motion";
import { Star, Shield, CreditCard } from "lucide-react";

const testimonials = [
  { quote: "MailVet reduced our bounce rate by 60% in the first month. Our email deliverability has never been better!", author: "Sarah Johnson", role: "Marketing Director", company: "TechFlow Inc." },
  { quote: "The API is incredibly easy to integrate. We had it running in production within an hour. Fantastic developer experience.", author: "Ahmed Hassan", role: "Lead Developer", company: "StartupHub" },
  { quote: "Finally, an email validation service that's both accurate and affordable. The 100 free credits let us test thoroughly.", author: "Maria Garcia", role: "Email Operations", company: "GrowthMail" },
];

const badges = [
  { icon: Shield, text: "GDPR Compliant" },
  { icon: CreditCard, text: "Secure Payments via Dodo" },
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(270,50%,5%)]" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-[hsl(267,100%,60%)] mb-4">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            <span className="text-white">Trusted by </span>
            <span className="marketing-gradient-text">Thousands</span>
          </h2>
          <p className="text-lg text-[hsl(270,20%,70%)] max-w-2xl mx-auto">
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
              className="p-7 rounded-2xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)] hover:border-[hsl(267,100%,60%)/0.3] transition-all duration-300"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white mb-6 text-base leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-[hsl(270,20%,65%)]">{testimonial.role} at {testimonial.company}</p>
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
            <div key={badge.text} className="flex items-center gap-3 px-5 py-3 rounded-full border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)]">
              <badge.icon className="w-4 h-4 text-[hsl(267,100%,60%)]" />
              <span className="text-sm font-medium text-white">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
