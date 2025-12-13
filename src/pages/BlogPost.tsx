import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { blogPosts } from "./Blog";

const blogContent: Record<string, { content: string }> = {
  "what-is-email-validation": {
    content: `
Email validation is the process of verifying whether an email address is valid, deliverable, and belongs to a real person. It's a critical step in email marketing that helps businesses maintain clean email lists, improve deliverability rates, and protect their sender reputation.

## Why Email Validation Matters

Email validation is essential for several reasons:

1. **Improved Deliverability**: Invalid emails cause bounces, which hurt your sender reputation and can lead to your emails being marked as spam.

2. **Cost Savings**: Most email service providers charge based on list size. Removing invalid emails reduces costs.

3. **Better Analytics**: Clean lists provide accurate open and click rates, helping you make better marketing decisions.

4. **Fraud Prevention**: Email validation helps detect fake sign-ups and potential fraud attempts.

## How Email Validation Works

The email validation process typically includes multiple checks:

### Syntax Validation
Checks if the email follows the correct format (user@domain.com).

### Domain Validation
Verifies that the domain exists and has valid MX records.

### Mailbox Verification
Confirms that the specific mailbox exists on the mail server.

### Additional Checks
- Disposable email detection
- Role-based email detection
- Spam trap identification
- Catch-all server detection

## Best Practices for Email Validation

1. **Validate at the point of capture**: Implement real-time validation on signup forms.

2. **Regularly clean your lists**: Validate your entire list at least quarterly.

3. **Use double opt-in**: Require email confirmation for new subscribers.

4. **Monitor bounce rates**: Track and act on bounce data.

5. **Choose a reliable validation service**: Use a service with high accuracy rates like MailVet.

## Conclusion

Email validation is not optional for serious email marketers. It's an investment that pays for itself through improved deliverability, lower costs, and better campaign performance.
    `
  }
};

// Generate placeholder content for other posts
blogPosts.forEach(post => {
  if (!blogContent[post.slug]) {
    blogContent[post.slug] = {
      content: `
This is a comprehensive guide about ${post.title.toLowerCase()}.

## Introduction

${post.excerpt}

## Key Points

Email validation is crucial for maintaining a healthy email list and ensuring high deliverability rates. Here's what you need to know:

### Understanding the Basics

Email validation involves multiple verification steps to ensure each email address on your list is valid and deliverable. This process helps protect your sender reputation and improve campaign performance.

### Best Practices

1. **Validate regularly**: Don't let your list become stale. Regular validation catches addresses that have become invalid.

2. **Implement real-time validation**: Stop invalid emails at the source by validating during signup.

3. **Monitor your metrics**: Keep an eye on bounce rates and engagement metrics.

4. **Use a reliable service**: Choose an email validation provider with proven accuracy.

### Benefits

- Improved email deliverability
- Better sender reputation
- Reduced marketing costs
- More accurate campaign analytics
- Protection against spam traps

## Conclusion

Implementing proper email validation practices is essential for any business that relies on email marketing. With tools like MailVet, you can easily maintain a clean, high-quality email list that delivers results.

Start validating your email list today with MailVet's unlimited verification plans.
      `
    };
  }
});

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <Link to="/blog" className="text-cyan hover:underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const content = blogContent[slug || ""]?.content || "";

  return (
    <>
      <Helmet>
        <title>{post.title} | MailVet Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24">
          <article className="py-16">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <Link 
                  to="/blog" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-cyan bg-cyan/10 px-3 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                  {post.title}
                </h1>

                <div className="prose prose-invert prose-lg max-w-none">
                  {content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ') || paragraph.startsWith('5. ')) {
                      return <p key={index} className="text-muted-foreground mb-2 pl-4">{paragraph}</p>;
                    }
                    if (paragraph.startsWith('- ')) {
                      return <p key={index} className="text-muted-foreground mb-2 pl-4">{paragraph}</p>;
                    }
                    if (paragraph.trim()) {
                      return <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>;
                    }
                    return null;
                  })}
                </div>

                <div className="mt-12 pt-8 border-t border-border/30">
                  <h3 className="text-xl font-semibold mb-4">Ready to validate your email list?</h3>
                  <p className="text-muted-foreground mb-6">
                    Start with 100 free credits and experience unlimited email validation with MailVet.
                  </p>
                  <Link 
                    to="/access?page=signup"
                    className="inline-flex items-center gap-2 bg-cyan text-background px-6 py-3 rounded-lg font-semibold hover:bg-cyan/90 transition-colors"
                  >
                    Get Started Free
                  </Link>
                </div>
              </motion.div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
