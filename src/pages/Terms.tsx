import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | MailVet - Email Validation Service</title>
        <meta name="description" content="Read MailVet's terms of service for using our email validation platform. Understand your rights and responsibilities." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24">
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 13, 2024</p>

                <div className="prose prose-invert max-w-none space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground">
                      By accessing or using MailVet's email validation services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                    <p className="text-muted-foreground">
                      MailVet provides email validation and verification services that help businesses verify the deliverability and validity of email addresses. Our services include real-time validation, bulk list processing, and related features.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
                    <p className="text-muted-foreground mb-4">To use our services, you must:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Provide accurate and complete registration information</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Be at least 18 years old or have legal authority to enter into this agreement</li>
                      <li>Not share your account with unauthorized users</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                    <p className="text-muted-foreground mb-4">You agree not to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Use our services for any unlawful purpose</li>
                      <li>Upload malicious content or attempt to compromise our systems</li>
                      <li>Resell our services without authorization</li>
                      <li>Use our services to validate email lists obtained illegally</li>
                      <li>Attempt to circumvent usage limits or billing</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Pricing and Payment</h2>
                    <p className="text-muted-foreground">
                      Subscription fees are billed in advance on a monthly basis. All payments are non-refundable except as required by law. We reserve the right to modify pricing with 30 days notice.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Service Accuracy</h2>
                    <p className="text-muted-foreground">
                      While we strive for the highest accuracy in email validation, we do not guarantee 100% accuracy. Email validation results should be used as guidance, and users acknowledge that some valid emails may be marked as invalid and vice versa.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                    <p className="text-muted-foreground">
                      MailVet shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                    <p className="text-muted-foreground">
                      We may terminate or suspend your account at any time for violation of these terms. You may cancel your subscription at any time through your account settings.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                    <p className="text-muted-foreground">
                      We reserve the right to modify these terms at any time. We will notify users of material changes via email or through our service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                    <p className="text-muted-foreground">
                      For questions about these Terms of Service, contact us at{" "}
                      <a href="mailto:contact@mailvet.app" className="text-cyan hover:underline">
                        contact@mailvet.app
                      </a>
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
