import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, FileSpreadsheet, Target, ShieldAlert, Code, Lock, LucideIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { features } from "@/data/features";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  FileSpreadsheet,
  Target,
  ShieldAlert,
  Code,
  Lock
};

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/20" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-rose-500/20" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/20" }
};

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Email Verification Features | MailVet - Complete Email Validation Suite</title>
        <meta 
          name="description" 
          content="Explore MailVet's complete email verification features: real-time validation, bulk list cleaning, 99% accuracy, disposable detection, developer API, and GDPR compliance." 
        />
        <meta name="keywords" content="email verification features, email validation API, bulk email checker, disposable email detection, GDPR email verification, MailVet features" />
        <link rel="canonical" href="https://mailvet.com/features" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-[120px] opacity-20" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="text-overline text-cyan mb-4 block">FEATURES</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Powerful Email Verification{" "}
                <span className="gradient-text">Features</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Everything you need to validate emails, protect your sender reputation, 
                and ensure your messages reach real inboxes. Explore our comprehensive 
                email verification toolkit.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/access?page=signup">
                  <Button size="lg" className="text-lg px-8">
                    100 Free Credits
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                const colors = colorMap[feature.iconColor];

                return (
                  <motion.div
                    key={feature.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/features/${feature.slug}`}
                      className="block h-full group"
                    >
                      <div className={`h-full p-8 rounded-2xl border border-border/30 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:shadow-xl ${colors.glow}`}>
                        <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          {Icon && <Icon className={`w-7 h-7 ${colors.text}`} />}
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {feature.heroSubtitle.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          Learn more
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto p-12 rounded-3xl border border-border/30 bg-card/50 backdrop-blur-sm"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Validate Your Emails?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start with 100 free credits. No credit card required. 
                Experience 99% accuracy email verification today.
              </p>
              <Link to="/access?page=signup">
                <Button size="lg" className="text-lg px-10">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Features;
