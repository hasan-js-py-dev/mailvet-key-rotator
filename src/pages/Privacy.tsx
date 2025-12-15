import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Privacy() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1500], [0, -200]);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | MailVet - Email Validation Service</title>
        <meta name="description" content="MailVet's privacy policy explains how we collect, use, and protect your personal information when using our email validation services." />
      </Helmet>
      
      <div className="min-h-screen bg-[hsl(270,100%,2%)] text-white relative overflow-hidden">
        <motion.div style={{ y: y1 }} className="glow-orb glow-orb-violet w-[500px] h-[500px] -top-40 -right-40 fixed opacity-30" />

        <Navbar />
        
        <main className="pt-24 relative z-10">
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
                <p className="text-[hsl(270,20%,60%)] mb-8">Last updated: December 13, 2024</p>

                <div className="space-y-8">
                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      MailVet ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our email validation service.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
                    <p className="text-[hsl(270,20%,70%)] mb-4">We collect information you provide directly to us, including:</p>
                    <ul className="list-disc pl-6 text-[hsl(270,20%,70%)] space-y-2">
                      <li>Account information (name, email address, password)</li>
                      <li>Payment information (processed securely via third-party providers)</li>
                      <li>Email lists you upload for validation</li>
                      <li>Usage data and analytics</li>
                    </ul>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
                    <p className="text-[hsl(270,20%,70%)] mb-4">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 text-[hsl(270,20%,70%)] space-y-2">
                      <li>Provide and maintain our email validation services</li>
                      <li>Process transactions and send related information</li>
                      <li>Send technical notices and support messages</li>
                      <li>Respond to your comments and questions</li>
                      <li>Improve our services and develop new features</li>
                    </ul>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      We implement appropriate technical and organizational measures to protect the security of your personal information. Email lists are processed securely and deleted within 30 days of validation.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">5. Your Rights</h2>
                    <p className="text-[hsl(270,20%,70%)] mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 text-[hsl(270,20%,70%)] space-y-2">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to processing of your data</li>
                      <li>Data portability</li>
                    </ul>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">6. Contact Us</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      If you have questions about this Privacy Policy, please contact us at{" "}
                      <a href="mailto:contact@mailvet.app" className="text-[hsl(267,100%,60%)] hover:text-[hsl(267,100%,70%)]">contact@mailvet.app</a>
                    </p>
                  </section>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
