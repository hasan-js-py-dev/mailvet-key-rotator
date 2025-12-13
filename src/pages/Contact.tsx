import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Mail, MessageSquare, Clock } from "lucide-react";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact MailVet - Get Help with Email Validation</title>
        <meta name="description" content="Contact MailVet for email validation support, partnership inquiries, or any questions. Our team is here to help you succeed." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center mb-16"
              >
                <span className="text-cyan text-sm font-medium tracking-wider uppercase">Get in Touch</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                  Contact Us
                </h1>
                <p className="text-xl text-muted-foreground">
                  Have questions? Our team is here to help you get the most out of MailVet.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card/50 border border-border/30 rounded-xl p-8 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get help from our support team via email.
                  </p>
                  <a 
                    href="mailto:contact@mailvet.app"
                    className="text-cyan hover:underline font-medium"
                  >
                    contact@mailvet.app
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card/50 border border-border/30 rounded-xl p-8 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sales Inquiries</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Interested in enterprise or custom plans?
                  </p>
                  <a 
                    href="mailto:contact@mailvet.app"
                    className="text-cyan hover:underline font-medium"
                  >
                    contact@mailvet.app
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-card/50 border border-border/30 rounded-xl p-8 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    We typically respond within 24 hours.
                  </p>
                  <span className="text-foreground font-medium">
                    Mon - Fri, 9AM - 6PM EST
                  </span>
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
