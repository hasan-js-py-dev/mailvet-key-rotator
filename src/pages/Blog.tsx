import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const blogPosts = [
  {
    slug: "what-is-email-validation",
    title: "What is Email Validation? A Complete Guide for 2024",
    excerpt: "Learn everything about email validation, how it works, and why it's essential for your email marketing success.",
    category: "Guides",
    readTime: "8 min read",
    date: "Dec 10, 2024"
  },
  {
    slug: "email-verification-vs-validation",
    title: "Email Verification vs Email Validation: Key Differences Explained",
    excerpt: "Understand the difference between email verification and validation, and which one your business needs.",
    category: "Education",
    readTime: "6 min read",
    date: "Dec 8, 2024"
  },
  {
    slug: "reduce-email-bounce-rate",
    title: "How to Reduce Email Bounce Rate: 10 Proven Strategies",
    excerpt: "Discover actionable strategies to reduce your email bounce rate and improve deliverability.",
    category: "Best Practices",
    readTime: "10 min read",
    date: "Dec 5, 2024"
  },
  {
    slug: "email-list-hygiene-best-practices",
    title: "Email List Hygiene: Best Practices for Clean Email Lists",
    excerpt: "Master email list hygiene with proven best practices to maintain a healthy, engaged subscriber base.",
    category: "Best Practices",
    readTime: "7 min read",
    date: "Dec 3, 2024"
  },
  {
    slug: "catch-all-emails-explained",
    title: "What Are Catch-All Emails? How to Handle Them Effectively",
    excerpt: "Learn what catch-all email addresses are and the best strategies for handling them in your campaigns.",
    category: "Education",
    readTime: "5 min read",
    date: "Dec 1, 2024"
  },
  {
    slug: "disposable-email-detection",
    title: "Disposable Email Detection: Protect Your List from Temporary Emails",
    excerpt: "Discover how to identify and filter disposable email addresses to protect your sender reputation.",
    category: "Security",
    readTime: "6 min read",
    date: "Nov 28, 2024"
  },
  {
    slug: "email-deliverability-guide",
    title: "Email Deliverability Guide: Land in the Inbox Every Time",
    excerpt: "A comprehensive guide to improving email deliverability and avoiding the spam folder.",
    category: "Guides",
    readTime: "12 min read",
    date: "Nov 25, 2024"
  },
  {
    slug: "spam-trap-prevention",
    title: "Spam Trap Prevention: How to Avoid Email Blacklists",
    excerpt: "Learn how spam traps work and how to prevent them from damaging your sender reputation.",
    category: "Security",
    readTime: "8 min read",
    date: "Nov 22, 2024"
  },
  {
    slug: "bulk-email-validation-guide",
    title: "Bulk Email Validation: Complete Guide for Large Lists",
    excerpt: "Everything you need to know about validating large email lists efficiently and accurately.",
    category: "Guides",
    readTime: "9 min read",
    date: "Nov 20, 2024"
  },
  {
    slug: "email-validation-for-ecommerce",
    title: "Email Validation for E-commerce: Boost Sales & Reduce Fraud",
    excerpt: "How e-commerce businesses can use email validation to increase conversions and prevent fraud.",
    category: "Industry",
    readTime: "7 min read",
    date: "Nov 18, 2024"
  },
  {
    slug: "real-time-email-verification",
    title: "Real-Time Email Verification: Capture Valid Leads Instantly",
    excerpt: "Implement real-time email verification to capture only valid email addresses from your forms.",
    category: "Integration",
    readTime: "6 min read",
    date: "Nov 15, 2024"
  },
  {
    slug: "email-validation-for-saas",
    title: "Email Validation for SaaS: Reduce Churn & Improve Onboarding",
    excerpt: "How SaaS companies can leverage email validation to improve user onboarding and reduce churn.",
    category: "Industry",
    readTime: "8 min read",
    date: "Nov 12, 2024"
  },
  {
    slug: "mx-record-validation",
    title: "MX Record Validation: Understanding DNS Email Checks",
    excerpt: "Learn how MX record validation works and why it's crucial for email verification.",
    category: "Technical",
    readTime: "5 min read",
    date: "Nov 10, 2024"
  },
  {
    slug: "email-validation-roi",
    title: "Email Validation ROI: Calculate Your Savings",
    excerpt: "Calculate the return on investment from email validation and justify the cost to stakeholders.",
    category: "Business",
    readTime: "6 min read",
    date: "Nov 8, 2024"
  },
  {
    slug: "role-based-email-detection",
    title: "Role-Based Email Detection: Why info@ and sales@ Matter",
    excerpt: "Understand role-based emails and how to handle them in your email marketing strategy.",
    category: "Education",
    readTime: "5 min read",
    date: "Nov 5, 2024"
  },
  {
    slug: "email-validation-for-agencies",
    title: "Email Validation for Marketing Agencies: Client Success Guide",
    excerpt: "How marketing agencies can use email validation to deliver better results for their clients.",
    category: "Industry",
    readTime: "7 min read",
    date: "Nov 3, 2024"
  },
  {
    slug: "smtp-verification-explained",
    title: "SMTP Verification Explained: How Email Servers Communicate",
    excerpt: "A technical deep-dive into SMTP verification and how it validates email addresses.",
    category: "Technical",
    readTime: "8 min read",
    date: "Nov 1, 2024"
  },
  {
    slug: "email-validation-mistakes",
    title: "10 Email Validation Mistakes That Kill Your Deliverability",
    excerpt: "Avoid these common email validation mistakes that damage your sender reputation.",
    category: "Best Practices",
    readTime: "9 min read",
    date: "Oct 28, 2024"
  },
  {
    slug: "gdpr-email-validation",
    title: "GDPR and Email Validation: Compliance Best Practices",
    excerpt: "Ensure your email validation practices comply with GDPR and other privacy regulations.",
    category: "Compliance",
    readTime: "7 min read",
    date: "Oct 25, 2024"
  },
  {
    slug: "email-warm-up-validation",
    title: "Email Warm-Up & Validation: The Perfect Combination",
    excerpt: "Learn how to combine email warm-up with validation for maximum deliverability.",
    category: "Best Practices",
    readTime: "6 min read",
    date: "Oct 22, 2024"
  },
  {
    slug: "email-validation-integration-guide",
    title: "Email Validation Integration Guide: CRMs, ESPs & More",
    excerpt: "Step-by-step guide to integrating email validation with popular marketing tools.",
    category: "Integration",
    readTime: "10 min read",
    date: "Oct 20, 2024"
  },
  {
    slug: "sender-reputation-management",
    title: "Sender Reputation Management: Protect Your Email Domain",
    excerpt: "Comprehensive guide to building and maintaining a strong sender reputation.",
    category: "Best Practices",
    readTime: "8 min read",
    date: "Oct 18, 2024"
  },
];

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Email Validation Blog - Tips, Guides & Best Practices | MailVet</title>
        <meta name="description" content="Expert insights on email validation, deliverability, and list hygiene. Learn best practices to improve your email marketing success." />
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
                <span className="text-cyan text-sm font-medium tracking-wider uppercase">Resources</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                  Email Validation Blog
                </h1>
                <p className="text-xl text-muted-foreground">
                  Expert insights, guides, and best practices for email validation and deliverability.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="block bg-card/50 border border-border/30 rounded-xl p-6 h-full hover:border-cyan/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-cyan bg-cyan/10 px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold mb-3 group-hover:text-cyan transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </motion.article>
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
