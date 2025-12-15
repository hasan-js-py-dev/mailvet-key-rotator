import { Helmet } from "react-helmet";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, FileSpreadsheet, Target, ShieldAlert, Code, Lock, LucideIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { features } from "@/data/features";

const iconMap: Record<string, LucideIcon> = { Zap, FileSpreadsheet, Target, ShieldAlert, Code, Lock };

const Features = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -200]);

  return (
    <>
      <Helmet>
        <title>Email Verification Features | MailVet - Complete Email Validation Suite</title>
        <meta name="description" content="Explore MailVet's complete email verification features: real-time validation, bulk list cleaning, 99% accuracy, disposable detection, developer API, and GDPR compliance." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(270,100%,2%)] text-white relative overflow-hidden">
        {/* Parallax glow orbs */}
        <motion.div style={{ y: y1 }} className="glow-orb glow-orb-violet w-[600px] h-[600px] -top-40 left-1/4 fixed opacity-40" />
        <motion.div style={{ y: y2 }} className="glow-orb glow-orb-blue w-[500px] h-[500px] top-1/2 -right-40 fixed opacity-30" />

        <Navbar />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="container mx-auto px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
              >
                <span className="text-overline text-[hsl(267,100%,60%)] mb-4 block">FEATURES</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-white">Powerful Email Verification </span>
                  <span className="marketing-gradient-text">Features</span>
                </h1>
                <p className="text-lg md:text-xl text-[hsl(270,20%,70%)] max-w-3xl mx-auto mb-8">
                  Everything you need to validate emails, protect your sender reputation, and ensure your messages reach real inboxes.
                </p>
                <Link to="/access?page=signup">
                  <Button size="lg" className="marketing-cta text-white text-lg px-8 rounded-full">
                    <span className="relative z-10 flex items-center gap-2">100 Free Credits <ArrowRight className="w-5 h-5" /></span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 relative">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = iconMap[feature.icon];
                  return (
                    <motion.div
                      key={feature.slug}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link to={`/features/${feature.slug}`} className="block h-full group">
                        <div className="h-full p-8 rounded-2xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)] hover:border-[hsl(267,100%,60%)/0.4] hover:bg-[hsl(270,50%,8%)] transition-all duration-300">
                          <div className="w-14 h-14 rounded-xl bg-[hsl(267,100%,60%)/0.1] border border-[hsl(267,100%,60%)/0.2] flex items-center justify-center mb-6 group-hover:bg-[hsl(267,100%,60%)/0.15] group-hover:scale-110 transition-all">
                            {Icon && <Icon className="w-7 h-7 text-[hsl(267,100%,60%)]" />}
                          </div>
                          <h2 className="text-xl font-bold mb-3 text-white group-hover:text-[hsl(267,100%,60%)] transition-colors">{feature.title}</h2>
                          <p className="text-[hsl(270,20%,65%)] mb-4 leading-relaxed">{feature.heroSubtitle.substring(0, 150)}...</p>
                          <div className="flex items-center gap-2 text-[hsl(267,100%,60%)] font-semibold">
                            Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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
                className="text-center max-w-3xl mx-auto p-12 rounded-3xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)]"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Validate Your Emails?</h2>
                <p className="text-lg text-[hsl(270,20%,70%)] mb-8">Start with 100 free credits. No credit card required.</p>
                <Link to="/access?page=signup">
                  <Button size="lg" className="marketing-cta text-white text-lg px-10 rounded-full">
                    <span className="relative z-10 flex items-center gap-2">Get Started Free <ArrowRight className="w-5 h-5" /></span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Features;
