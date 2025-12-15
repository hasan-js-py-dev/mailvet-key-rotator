import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Code2, Users, Building, Heart, GraduationCap, Building2, Shield, Home, Plane, Calendar, Megaphone, Database, TrendingUp, Smartphone, CreditCard, MessageSquare, Newspaper, Gamepad2, Truck, Factory, Briefcase, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useCases } from "@/data/useCases";

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart, Code2, Users, Building, Heart, GraduationCap, Building2, Shield, Home, Plane, Calendar, Megaphone, Database, TrendingUp, Smartphone, CreditCard, MessageSquare, Newspaper, Gamepad: Gamepad2, Truck, Factory, Briefcase,
};

const UseCases = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -200]);

  return (
    <>
      <Helmet>
        <title>Email Verification Use Cases by Industry | MailVet</title>
        <meta name="description" content="Discover how MailVet's 99% accurate email verification helps businesses across 24 industries reduce bounces, prevent fraud, and improve deliverability." />
      </Helmet>

      <div className="min-h-screen bg-[hsl(270,100%,2%)] text-white relative overflow-hidden">
        {/* Parallax glow orbs */}
        <motion.div style={{ y: y1 }} className="glow-orb glow-orb-violet w-[600px] h-[600px] -top-40 -right-40 fixed opacity-40" />
        <motion.div style={{ y: y2 }} className="glow-orb glow-orb-blue w-[500px] h-[500px] top-1/2 -left-40 fixed opacity-30" />

        <Navbar />
        
        <main className="pt-24 pb-16 relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <p className="text-overline text-[hsl(267,100%,60%)] mb-4">Industry Solutions</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Email Verification for </span>
                <span className="marketing-gradient-text">Every Industry</span>
              </h1>
              <p className="text-lg md:text-xl text-[hsl(270,20%,70%)] max-w-2xl mx-auto">
                Discover how MailVet's 99% accurate email verification solves unique challenges across 24 industries.
              </p>
            </motion.div>
          </section>

          {/* Use Cases Grid */}
          <section className="container mx-auto px-6 pb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => {
                const IconComponent = iconMap[useCase.icon] || Megaphone;
                return (
                  <motion.div
                    key={useCase.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/use-cases/${useCase.slug}`} className="group block h-full">
                      <div className="h-full p-6 rounded-2xl border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,6%)] hover:border-[hsl(267,100%,60%)/0.4] hover:bg-[hsl(270,50%,8%)] transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-[hsl(267,100%,60%)/0.1] border border-[hsl(267,100%,60%)/0.2] flex items-center justify-center mb-4 group-hover:bg-[hsl(267,100%,60%)/0.15] group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-6 h-6 text-[hsl(267,100%,60%)]" />
                        </div>
                        <h2 className="text-lg font-semibold mb-2 text-white group-hover:text-[hsl(267,100%,60%)] transition-colors">{useCase.title}</h2>
                        <p className="text-[hsl(270,20%,65%)] text-sm leading-relaxed mb-4 line-clamp-2">{useCase.heroSubtitle}</p>
                        <div className="flex items-center gap-2 text-[hsl(267,100%,60%)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Learn more</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Improve Your Email Deliverability?</h2>
              <p className="text-lg text-[hsl(270,20%,70%)] mb-8">Start with 100 free credits and see the difference clean data makes.</p>
              <Link to="/access?page=signup" className="inline-flex items-center gap-2 px-8 py-4 marketing-cta text-white rounded-full font-semibold text-lg transition-colors">
                <span className="relative z-10 flex items-center gap-2">Start Your Free Trial <ArrowRight className="w-5 h-5" /></span>
              </Link>
            </motion.div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UseCases;
