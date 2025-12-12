import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Code2, 
  Users, 
  Building, 
  Heart, 
  GraduationCap,
  Building2,
  Shield,
  Home,
  Plane,
  Calendar,
  Megaphone,
  Database,
  TrendingUp,
  Smartphone,
  CreditCard,
  MessageSquare,
  Newspaper,
  Gamepad2,
  Truck,
  Factory,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useCases } from "@/data/useCases";

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart,
  Code2,
  Users,
  Building,
  Heart,
  GraduationCap,
  Building2,
  Shield,
  Home,
  Plane,
  Calendar,
  Megaphone,
  Database,
  TrendingUp,
  Smartphone,
  CreditCard,
  MessageSquare,
  Newspaper,
  Gamepad: Gamepad2,
  Truck,
  Factory,
  Briefcase,
};

const UseCases = () => {
  return (
    <>
      <Helmet>
        <title>Email Verification Use Cases by Industry | MailVet</title>
        <meta name="description" content="Discover how MailVet's 99% accurate email verification helps businesses across 24 industries reduce bounces, prevent fraud, and improve deliverability." />
        <meta property="og:title" content="Email Verification Use Cases by Industry | MailVet" />
        <meta property="og:description" content="Discover how MailVet's 99% accurate email verification helps businesses across 24 industries reduce bounces, prevent fraud, and improve deliverability." />
        <link rel="canonical" href="https://mailvet.com/use-cases" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <p className="text-overline text-cyan mb-4">Industry Solutions</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Email Verification for{" "}
                <span className="gradient-text">Every Industry</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover how MailVet's 99% accurate email verification solves unique challenges across 24 industries. From reducing bounces to preventing fraud, we've got you covered.
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
                    <Link
                      to={`/use-cases/${useCase.slug}`}
                      className="group block h-full"
                    >
                      <div className="h-full p-6 rounded-2xl border border-border/30 bg-card/30 hover:border-cyan/40 hover:bg-card/60 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-4 group-hover:bg-cyan/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-6 h-6 text-cyan" />
                        </div>
                        
                        <h2 className="text-lg font-semibold mb-2 text-foreground group-hover:text-cyan transition-colors">
                          {useCase.title}
                        </h2>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {useCase.heroSubtitle}
                        </p>
                        
                        <div className="flex items-center gap-2 text-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Improve Your Email Deliverability?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start with 100 free credits and see the difference clean data makes.
              </p>
              <Link
                to="/access?page=signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg transition-colors"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
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
