import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Zap, 
  FileSpreadsheet, 
  Target, 
  ShieldAlert, 
  Code, 
  Lock,
  LucideIcon
} from "lucide-react";
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

const colorMap: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", gradient: "from-amber-500/20 to-amber-600/5" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", gradient: "from-violet-500/20 to-violet-600/5" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", gradient: "from-emerald-500/20 to-emerald-600/5" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", gradient: "from-rose-500/20 to-rose-600/5" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", gradient: "from-blue-500/20 to-blue-600/5" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", gradient: "from-cyan-500/20 to-cyan-600/5" }
};

const FeatureDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const feature = features.find(f => f.slug === slug);
  const { scrollYProgress } = useScroll();
  
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  if (!feature) {
    return <Navigate to="/features" replace />;
  }

  const Icon = iconMap[feature.icon];
  const colors = colorMap[feature.iconColor];

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": feature.title,
    "description": feature.metaDescription,
    "brand": {
      "@type": "Brand",
      "name": "MailVet"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Helmet>
        <title>{feature.metaTitle}</title>
        <meta name="description" content={feature.metaDescription} />
        <meta name="keywords" content={feature.targetKeywords.join(", ")} />
        <link rel="canonical" href={`https://mailvet.com/features/${feature.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={feature.metaTitle} />
        <meta property="og:description" content={feature.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mailvet.com/features/${feature.slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={feature.metaTitle} />
        <meta name="twitter:description" content={feature.metaDescription} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
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

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
              <Link to="/features" className="inline-flex items-center gap-2 text-marketing-text-secondary hover:text-marketing-violet transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Features
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl"
              >
                <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}>
                  {Icon && <Icon className={`w-8 h-8 ${colors.text}`} />}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 marketing-gradient-text">
                  {feature.heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-marketing-text-secondary max-w-3xl mb-8">
                  {feature.heroSubtitle}
                </p>
                <Link to="/access?page=signup">
                  <Button size="lg" className="marketing-cta text-lg px-8">
                    100 Free Credits
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Introduction */}
          <section className="py-16 relative">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <p className="text-lg leading-relaxed text-marketing-text-secondary">
                  {feature.content.introduction}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Statistics */}
          <section className="py-12 relative">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                {feature.content.statistics.map((stat, index) => (
                  <div
                    key={index}
                    className={`marketing-card p-6 text-center`}
                  >
                    <p className={`text-4xl font-bold ${colors.text} mb-2`}>{stat.stat}</p>
                    <p className="text-sm text-marketing-text-secondary">{stat.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 relative">
            <div className="absolute inset-0 bg-marketing-dark-panel/30" />
            <div className="container mx-auto px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  {feature.content.howItWorks.title}
                </h2>
                <p className="text-lg text-marketing-text-secondary leading-relaxed">
                  {feature.content.howItWorks.description}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 relative">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white">
                  Key Benefits
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {feature.content.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="marketing-card p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                          <Check className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-white">{benefit.title}</h3>
                          <p className="text-marketing-text-secondary">{benefit.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Technical Details & Use Cases */}
          <section className="py-16 relative">
            <div className="absolute inset-0 bg-marketing-dark-panel/30" />
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Technical Details */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="marketing-card p-8"
                >
                  <h3 className="text-xl font-bold mb-6 text-white">{feature.content.technicalDetails.title}</h3>
                  <ul className="space-y-3">
                    {feature.content.technicalDetails.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-marketing-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Use Cases */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="marketing-card p-8"
                >
                  <h3 className="text-xl font-bold mb-6 text-white">Perfect For</h3>
                  <ul className="space-y-3">
                    {feature.content.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')} flex-shrink-0 mt-2`} />
                        <span className="text-marketing-text-secondary">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
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
                className="text-center max-w-3xl mx-auto p-12 rounded-3xl border border-marketing-violet/30 bg-gradient-to-br from-marketing-violet/10 to-marketing-blue/10"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {feature.content.cta.split('.')[0]}
                </h2>
                <p className="text-lg text-marketing-text-secondary mb-8">
                  {feature.content.cta.split('.').slice(1).join('.')}
                </p>
                <Link to="/access?page=signup">
                  <Button size="lg" className="marketing-cta text-lg px-10">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Other Features */}
          <section className="py-16 relative">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-bold mb-8 text-center text-white">Explore More Features</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {features
                  .filter(f => f.slug !== feature.slug)
                  .slice(0, 3)
                  .map((otherFeature) => {
                    const OtherIcon = iconMap[otherFeature.icon];
                    const otherColors = colorMap[otherFeature.iconColor];
                    return (
                      <Link
                        key={otherFeature.slug}
                        to={`/features/${otherFeature.slug}`}
                        className="group marketing-card p-6"
                      >
                        <div className={`w-10 h-10 rounded-lg ${otherColors.bg} ${otherColors.border} border flex items-center justify-center mb-4`}>
                          {OtherIcon && <OtherIcon className={`w-5 h-5 ${otherColors.text}`} />}
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-marketing-violet transition-colors">
                          {otherFeature.title}
                        </h3>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FeatureDetail;
