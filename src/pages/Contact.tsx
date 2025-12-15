import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";
import { Mail, MessageSquare, Clock } from "lucide-react";

export default function Contact() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <>
      <Helmet>
        <title>Contact MailVet - Get Help with Email Validation</title>
        <meta name="description" content="Contact MailVet for email validation support, partnership inquiries, or any questions. Our team is here to help you succeed." />
      </Helmet>
      
      <div className="min-h-screen bg-[hsl(270,100%,2%)] text-white relative overflow-hidden">
        {/* Parallax glow orbs */}
        <motion.div style={{ y: y1 }} className="glow-orb glow-orb-violet w-[500px] h-[500px] -top-40 -left-40 fixed opacity-40" />
        <motion.div style={{ y: y2 }} className="glow-orb glow-orb-blue w-[400px] h-[400px] top-1/2 -right-40 fixed opacity-30" />

        <Navbar />
        
        <main className="pt-24 relative z-10">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center mb-16"
              >
                <span className="text-overline text-[hsl(267,100%,60%)] mb-4 block">Get in Touch</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                  <span className="text-white">Contact </span>
                  <span className="marketing-gradient-text">Us</span>
                </h1>
                <p className="text-xl text-[hsl(270,20%,70%)]">
                  Have questions? Our team is here to help you get the most out of MailVet.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl p-8 text-center hover:border-[hsl(267,100%,60%)/0.3] transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[hsl(267,100%,60%)/0.1] flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-[hsl(267,100%,60%)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Email Support</h3>
                  <p className="text-[hsl(270,20%,65%)] text-sm mb-4">Get help from our support team via email.</p>
                  <a href="mailto:contact@mailvet.app" className="text-[hsl(267,100%,60%)] hover:text-[hsl(267,100%,70%)] font-medium">contact@mailvet.app</a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl p-8 text-center hover:border-[hsl(267,100%,60%)/0.3] transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[hsl(267,100%,60%)/0.1] flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-[hsl(267,100%,60%)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Sales Inquiries</h3>
                  <p className="text-[hsl(270,20%,65%)] text-sm mb-4">Interested in enterprise or custom plans?</p>
                  <a href="mailto:contact@mailvet.app" className="text-[hsl(267,100%,60%)] hover:text-[hsl(267,100%,70%)] font-medium">contact@mailvet.app</a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl p-8 text-center hover:border-[hsl(267,100%,60%)/0.3] transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-[hsl(267,100%,60%)/0.1] flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-[hsl(267,100%,60%)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Response Time</h3>
                  <p className="text-[hsl(270,20%,65%)] text-sm mb-4">We typically respond within 24 hours.</p>
                  <span className="text-white font-medium">Mon - Fri, 9AM - 6PM EST</span>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
