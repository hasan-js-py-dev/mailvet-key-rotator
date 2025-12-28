import { motion } from "framer-motion";
import { Target, TrendingUp, ShieldCheck, Clock, BarChart3, CheckCircle2 } from "lucide-react";

const reasons = [
  {
    icon: Target,
    title: "99% Accuracy Rate",
    description: "Industry-leading accuracy powered by multi-layer verification. We check SMTP responses, MX records, domain validity, and mailbox existence.",
    highlight: "99%",
    highlightLabel: "Accuracy",
  },
  {
    icon: TrendingUp,
    title: "Boost Deliverability",
    description: "Improve your email deliverability rates by up to 98%. Clean lists mean fewer bounces and better inbox placement.",
    highlight: "98%",
    highlightLabel: "Deliverability",
  },
  {
    icon: ShieldCheck,
    title: "Protect Sender Reputation",
    description: "Avoid spam traps and honeypots that damage your sender score. Our system identifies and removes risky addresses.",
    highlight: "100%",
    highlightLabel: "Protection",
  },
  {
    icon: Clock,
    title: "Real-Time Validation",
    description: "Validate emails at point of entry. Integrate with signup forms to prevent invalid emails from entering your database.",
    highlight: "10/sec",
    highlightLabel: "Speed",
  },
  {
    icon: BarChart3,
    title: "Reduce Bounce Rates",
    description: "Eliminate hard bounces that hurt your campaigns. Studies show even 2% bounce rate can trigger spam filters.",
    highlight: "<2%",
    highlightLabel: "Bounce Rate",
  },
  {
    icon: CheckCircle2,
    title: "Catch-All Detection",
    description: "Identify domains that accept all emails regardless of validity. Make informed decisions about risky addresses.",
    highlight: "100%",
    highlightLabel: "Detection",
  },
];

export const WhyChooseSection = () => {
  return (
    <section id="why-choose" className="relative py-24 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[hsl(270,50%,5%)]" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[hsl(267,100%,50%)] rounded-full blur-[180px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[hsl(212,93%,52%)] rounded-full blur-[200px] opacity-8" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-[hsl(267,100%,60%)] mb-4">Why MailVet</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            <span className="text-white">Built for </span>
            <span className="marketing-gradient-text">Maximum Accuracy</span>
          </h2>
          <p className="text-lg text-[hsl(270,20%,70%)] max-w-3xl mx-auto">
            Our email validation technology is trusted by thousands of marketers, developers, and businesses worldwide. 
            We combine multiple verification methods to deliver the most accurate results in the industry.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-7 rounded-2xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)] hover:border-[hsl(267,100%,60%)/0.4] hover:bg-[hsl(270,50%,8%)] transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(267,100%,60%)/0.1] border border-[hsl(267,100%,60%)/0.2] flex items-center justify-center group-hover:bg-[hsl(267,100%,60%)/0.15] transition-colors">
                    <reason.icon className="w-6 h-6 text-[hsl(267,100%,60%)]" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold gradient-text">{reason.highlight}</span>
                    <p className="text-xs text-[hsl(270,20%,60%)]">{reason.highlightLabel}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">{reason.title}</h3>
                <p className="text-[hsl(270,20%,65%)] text-sm leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)] backdrop-blur-sm max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">500M+</p>
              <p className="text-sm text-[hsl(270,20%,65%)]">Emails Validated</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">10K+</p>
              <p className="text-sm text-[hsl(270,20%,65%)]">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">99.9%</p>
              <p className="text-sm text-[hsl(270,20%,65%)]">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</p>
              <p className="text-sm text-[hsl(270,20%,65%)]">Support Available</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
