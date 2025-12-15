import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Terms() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1500], [0, -200]);

  return (
    <>
      <Helmet>
        <title>Terms of Service | MailVet - Email Validation Service</title>
        <meta name="description" content="Read MailVet's terms of service for using our email validation platform. Understand your rights and responsibilities." />
      </Helmet>
      
      <div className="min-h-screen bg-[hsl(270,100%,2%)] text-white relative overflow-hidden">
        <motion.div style={{ y: y1 }} className="glow-orb glow-orb-blue w-[500px] h-[500px] -top-40 -left-40 fixed opacity-30" />

        <Navbar />
        
        <main className="pt-24 relative z-10">
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
                <p className="text-[hsl(270,20%,60%)] mb-8">Last updated: December 13, 2024</p>

                <div className="space-y-6">
                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      By accessing or using MailVet's email validation services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      MailVet provides email validation and verification services that help businesses verify the deliverability and validity of email addresses. Our services include real-time validation, bulk list processing, and related features.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">3. Account Registration</h2>
                    <p className="text-[hsl(270,20%,70%)] mb-4">To use our services, you must:</p>
                    <ul className="list-disc pl-6 text-[hsl(270,20%,70%)] space-y-2">
                      <li>Provide accurate and complete registration information</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Be at least 18 years old or have legal authority to enter into this agreement</li>
                      <li>Not share your account with unauthorized users</li>
                    </ul>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">4. Acceptable Use</h2>
                    <p className="text-[hsl(270,20%,70%)] mb-4">You agree not to:</p>
                    <ul className="list-disc pl-6 text-[hsl(270,20%,70%)] space-y-2">
                      <li>Use our services for any unlawful purpose</li>
                      <li>Upload malicious content or attempt to compromise our systems</li>
                      <li>Resell our services without authorization</li>
                      <li>Use our services to validate email lists obtained illegally</li>
                      <li>Attempt to circumvent usage limits or billing</li>
                    </ul>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">5. Pricing and Payment</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      Subscription fees are billed in advance on a monthly basis. All payments are non-refundable except as required by law. We reserve the right to modify pricing with 30 days notice.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">6. Service Accuracy</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      While we strive for the highest accuracy in email validation, we do not guarantee 100% accuracy. Email validation results should be used as guidance.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      MailVet shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                    </p>
                  </section>

                  <section className="p-6 rounded-xl bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact</h2>
                    <p className="text-[hsl(270,20%,70%)]">
                      For questions about these Terms of Service, contact us at{" "}
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
