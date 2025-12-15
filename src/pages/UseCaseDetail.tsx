import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useScroll, useTransform } from "framer-motion";
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
  ArrowRight,
  Check,
  ArrowLeft
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { getUseCaseBySlug, useCases } from "@/data/useCases";
import { Button } from "@/components/ui/button";

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

const UseCaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const useCase = slug ? getUseCaseBySlug(slug) : undefined;
  const { scrollYProgress } = useScroll();
  
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  if (!useCase) {
    return <Navigate to="/use-cases" replace />;
  }

  const IconComponent = iconMap[useCase.icon] || Megaphone;
  
  // Get related use cases (excluding current one, limit to 3)
  const relatedUseCases = useCases
    .filter(uc => uc.slug !== useCase.slug)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{useCase.metaTitle}</title>
        <meta name="description" content={useCase.metaDescription} />
        <meta property="og:title" content={useCase.metaTitle} />
        <meta property="og:description" content={useCase.metaDescription} />
        <meta name="keywords" content={useCase.targetKeywords.join(", ")} />
        <link rel="canonical" href={`https://mailvet.com/use-cases/${useCase.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-marketing-dark relative overflow-hidden">
        {/* Animated glow orbs */}
        <motion.div 
          style={{ y: orb1Y }}
          className="glow-orb w-[600px] h-[600px] -top-40 -left-40 opacity-40"
        />
        <motion.div 
          style={{ y: orb2Y }}
          className="glow-orb glow-orb-blue w-[500px] h-[500px] top-1/3 -right-40 opacity-30"
        />
        
        <Navbar />
        
        <main className="pt-24 pb-16 relative z-10">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 py-4">
            <Link 
              to="/use-cases" 
              className="inline-flex items-center gap-2 text-marketing-text-secondary hover:text-marketing-violet transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Use Cases</span>
            </Link>
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-marketing-violet/10 border border-marketing-violet/30 flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-marketing-violet" />
                </div>
                <p className="text-overline text-marketing-violet uppercase tracking-wider font-semibold">{useCase.title}</p>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight marketing-gradient-text">
                {useCase.heroTitle}
              </h1>
              
              <p className="text-lg md:text-xl text-marketing-text-secondary mb-8 max-w-3xl">
                {useCase.heroSubtitle}
              </p>

              <Link to="/access?page=signup">
                <Button size="lg" className="marketing-cta text-lg px-8">
                  100 Free Credits
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </section>

          {/* Statistics */}
          <section className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
              {useCase.content.statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="marketing-card p-6 text-center"
                >
                  <div className="text-4xl font-bold text-marketing-violet mb-2">{stat.stat}</div>
                  <p className="text-marketing-text-secondary text-sm">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Main Content */}
          <article className="container mx-auto px-6 py-12">
            <div className="max-w-4xl">
              {/* Introduction */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <p className="text-lg text-white/90 leading-relaxed">
                  {useCase.content.introduction}
                </p>
              </motion.section>

              {/* Challenges */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                  {useCase.content.challenges.title}
                </h2>
                <ul className="space-y-4">
                  {useCase.content.challenges.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500 mt-2.5 flex-shrink-0" />
                      <span className="text-marketing-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Solution */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                  {useCase.content.solution.title}
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  {useCase.content.solution.description}
                </p>
              </motion.section>

              {/* Benefits */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                  Key Benefits
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {useCase.content.benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="marketing-card flex items-start gap-3 p-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-marketing-violet/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-marketing-violet" />
                      </div>
                      <span className="text-white/90">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* How It Works */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                  How It Works
                </h2>
                <div className="space-y-6">
                  {useCase.content.howItWorks.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-marketing-violet/20 border border-marketing-violet/30 flex items-center justify-center flex-shrink-0 text-marketing-violet font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-white">{step.step}</h3>
                        <p className="text-marketing-text-secondary">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Compliance (if present) */}
              {useCase.content.compliance && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-12 p-6 rounded-2xl border border-marketing-violet/20 bg-marketing-violet/5"
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-marketing-violet" />
                    Security & Compliance
                  </h2>
                  <p className="text-white/90">{useCase.content.compliance}</p>
                </motion.section>
              )}

              {/* CTA */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12 p-8 rounded-2xl border border-marketing-violet/30 bg-gradient-to-br from-marketing-violet/10 to-marketing-blue/10 text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Start Your Free Trial Today
                </h2>
                <p className="text-lg text-marketing-text-secondary mb-6 max-w-2xl mx-auto">
                  {useCase.content.cta}
                </p>
                <Link to="/access?page=signup">
                  <Button size="lg" className="marketing-cta text-lg px-8">
                    Get 100 Free Credits
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.section>
            </div>
          </article>

          {/* Related Use Cases */}
          <section className="container mx-auto px-6 py-12 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-8 text-white">Explore More Industries</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedUseCases.map((related) => {
                const RelatedIcon = iconMap[related.icon] || Megaphone;
                return (
                  <Link
                    key={related.slug}
                    to={`/use-cases/${related.slug}`}
                    className="group marketing-card p-6"
                  >
                    <div className="w-12 h-12 rounded-xl bg-marketing-violet/10 border border-marketing-violet/20 flex items-center justify-center mb-4 group-hover:bg-marketing-violet/20 transition-colors">
                      <RelatedIcon className="w-6 h-6 text-marketing-violet" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-marketing-violet transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-marketing-text-secondary text-sm line-clamp-2">
                      {related.heroSubtitle}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UseCaseDetail;
