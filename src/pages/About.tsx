import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";

const timeline = [
  { year: "2022", title: "Founded", description: "MailVet was born with a mission to provide unlimited, accurate email validation to growing businesses." },
  { year: "2023", title: "First 500 Clients", description: "Reached our first milestone of 500 satisfied clients across SaaS, agencies, and e-commerce." },
  { year: "2024", title: "Global Expansion", description: "Expanded our validation infrastructure to serve businesses across 50+ countries." },
  { year: "2025", title: "1M+ Verifications Daily", description: "Our platform now processes over 1 million email verifications daily with 99% accuracy." },
];

const values = [
  { title: "Accuracy First", description: "We verify every email through multiple checks to ensure maximum deliverability." },
  { title: "Client Success", description: "Your growth is our success. We measure ourselves by your results." },
  { title: "Unlimited Access", description: "No credit limits or per-email charges. Verify as many emails as you need." },
  { title: "Global Coverage", description: "Validate emails from any domain, any country, with consistent accuracy." },
];

const team = [
  { name: "Adam Zaki", role: "Founder & CEO", bio: "Visionary entrepreneur with 10+ years in email deliverability and data validation.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face" },
  { name: "Waqas Azeem", role: "Co-Founder & CTO", bio: "Tech innovator specializing in email verification systems and automation.", image: "https://www.vikileads.com/assets/waqas-azeem-Dlh5KcPc.jpg" },
  { name: "Rebecca Thompson", role: "Head of Marketing Strategy", bio: "Marketing strategist with expertise in email campaigns and B2B demand generation.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&crop=face" },
  { name: "Kathy Vogler", role: "Director of Business Development", bio: "Business development expert with a proven track record of building strategic partnerships.", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop&crop=face" },
  { name: "Sonaina Saleem", role: "Senior Campaign Manager", bio: "Email deliverability specialist managing end-to-end validation for enterprise clients.", image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=300&h=300&fit=crop&crop=face" },
];

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -200]);

  return (
    <>
      <Helmet>
        <title>About MailVet - Email Validation Company Since 2022</title>
        <meta name="description" content="Learn about MailVet, the email validation company founded in 2022. Meet our team of experts dedicated to providing unlimited, accurate email verification services." />
      </Helmet>
      
      <div className="min-h-screen bg-[hsl(270,100%,2%)] text-white relative overflow-hidden">
        {/* Parallax glow orbs */}
        <motion.div style={{ y: y1 }} className="glow-orb glow-orb-violet w-[600px] h-[600px] -top-40 -left-40 fixed opacity-50" />
        <motion.div style={{ y: y2 }} className="glow-orb glow-orb-blue w-[500px] h-[500px] top-1/3 -right-60 fixed opacity-40" />
        
        <Navbar />
        
        <main className="pt-24 relative z-10">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center"
              >
                <span className="text-overline text-[hsl(267,100%,60%)] mb-4 block">Our Story</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                  <span className="text-white">Helping Businesses Grow </span>
                  <span className="marketing-gradient-text">Since 2022</span>
                </h1>
                <p className="text-xl text-[hsl(270,20%,70%)] leading-relaxed">
                  We started MailVet with a simple belief: every business deserves access to unlimited, accurate email validation without per-credit pricing.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-[hsl(270,50%,4%)]">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-3xl font-bold mb-6 text-white">From Frustration to Solution</h2>
                  <p className="text-[hsl(270,20%,70%)] text-lg leading-relaxed mb-6">
                    In 2022, our founders Adam Zaki and Waqas Azeem faced a common challenge: finding accurate email validation without paying per-credit prices. After experiencing the frustration of credit-based systems, limited verifications, and services that charged more as you scaled, they decided to build something better.
                  </p>
                  <p className="text-[hsl(270,20%,70%)] text-lg leading-relaxed mb-6">
                    MailVet was born from the belief that quality email validation shouldn't be reserved for enterprises with big budgets. We built a proprietary verification system that checks every email against multiple validation layers, ensuring our clients get the most accurate results possible.
                  </p>
                  <p className="text-[hsl(270,20%,70%)] text-lg leading-relaxed">
                    What started as a small operation helping local marketing agencies has grown into a global email validation provider trusted by 500+ companies across 30+ countries.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="py-16 relative">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white">Our Journey</h2>
              </motion.div>
              
              <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-[hsl(267,100%,60%)] text-2xl font-bold mb-2">{item.year}</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                    <p className="text-[hsl(270,20%,65%)] text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-[hsl(270,50%,4%)]">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-white">Our Values</h2>
                <p className="text-[hsl(270,20%,65%)]">These principles guide everything we do at MailVet.</p>
              </motion.div>
              
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl p-6 hover:border-[hsl(267,100%,60%)/0.3] transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-white">{value.title}</h3>
                    <p className="text-[hsl(270,20%,65%)]">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <span className="text-overline text-[hsl(267,100%,60%)] mb-4 block">Meet Our Team</span>
                <h2 className="text-3xl font-bold mt-4 mb-4 text-white">The Experts Behind Your Success</h2>
                <p className="text-[hsl(270,20%,65%)] max-w-2xl mx-auto">
                  Our team of email validation and data specialists is dedicated to helping your business grow.
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl p-6 text-center hover:border-[hsl(267,100%,60%)/0.3] transition-colors"
                  >
                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-[hsl(267,100%,60%)/0.3]" />
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-[hsl(267,100%,60%)] text-sm mb-3">{member.role}</p>
                    <p className="text-[hsl(270,20%,65%)] text-sm">{member.bio}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
