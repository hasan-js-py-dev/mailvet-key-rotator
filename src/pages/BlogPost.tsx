import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Linkedin, Twitter } from "lucide-react";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug || "");
  const relatedPosts = getRelatedPosts(slug || "", 3);
  const { scrollYProgress } = useScroll();
  
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-marketing-dark">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Post Not Found</h1>
            <Link to="/blog" className="text-marketing-violet hover:underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl = `https://mailvet.app/blog/${post.slug}`;
  const shareText = post.title;

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | MailVet Blog</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <link rel="canonical" href={`https://mailvet.app/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://mailvet.app/blog/${post.slug}`} />
        <meta property="og:image" content={post.thumbnail} />
        <meta property="article:published_time" content={post.date} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.thumbnail} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription,
            "image": post.thumbnail,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "MailVet"
            },
            "publisher": {
              "@type": "Organization",
              "name": "MailVet",
              "url": "https://mailvet.app"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://mailvet.app/blog/${post.slug}`
            },
            "keywords": post.keywords.join(", ")
          })}
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
        
        <main className="pt-24 relative z-10">
          <article className="py-16">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                {/* Breadcrumb */}
                <Link 
                  to="/blog" 
                  className="inline-flex items-center gap-2 text-marketing-text-secondary hover:text-white mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>

                {/* Hero Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-white/10">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-marketing-dark/60 to-transparent" />
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-sm font-medium text-marketing-violet bg-marketing-violet/10 px-3 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-marketing-text-secondary">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-marketing-text-secondary">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 marketing-gradient-text">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-marketing-text-secondary mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 mb-10 pb-10 border-b border-white/10">
                  <span className="text-sm text-marketing-text-secondary flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share:
                  </span>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-8 h-8 rounded-full bg-marketing-dark-panel border border-white/10 flex items-center justify-center hover:border-marketing-violet/50 hover:text-marketing-violet transition-all text-white"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-8 h-8 rounded-full bg-marketing-dark-panel border border-white/10 flex items-center justify-center hover:border-marketing-violet/50 hover:text-marketing-violet transition-all text-white"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                  {post.content.split('\n').map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-white">
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-semibold mt-8 mb-3 text-white">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('| ')) {
                      // Simple table rendering
                      return (
                        <div key={index} className="overflow-x-auto my-4">
                          <pre className="text-sm text-marketing-text-secondary bg-marketing-dark-panel p-4 rounded-lg border border-white/10">
                            {trimmed}
                          </pre>
                        </div>
                      );
                    }
                    if (trimmed.startsWith('```')) {
                      return null; // Skip code block markers
                    }
                    if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
                      const isChecked = trimmed.startsWith('- [x]');
                      const text = trimmed.replace(/- \[.\] /, '');
                      return (
                        <div key={index} className="flex items-center gap-2 my-2">
                          <input type="checkbox" checked={isChecked} readOnly className="accent-marketing-violet" />
                          <span className="text-marketing-text-secondary">{text}</span>
                        </div>
                      );
                    }
                    if (/^\d+\. \*\*/.test(trimmed)) {
                      const match = trimmed.match(/^(\d+)\. \*\*(.+?)\*\*:?\s*(.*)$/);
                      if (match) {
                        return (
                          <div key={index} className="my-3">
                            <p className="text-marketing-text-secondary">
                              <span className="text-white font-semibold">{match[1]}. {match[2]}</span>
                              {match[3] && `: ${match[3]}`}
                            </p>
                          </div>
                        );
                      }
                    }
                    if (/^\d+\. /.test(trimmed)) {
                      return (
                        <p key={index} className="text-marketing-text-secondary my-2 pl-4">
                          {trimmed}
                        </p>
                      );
                    }
                    if (trimmed.startsWith('- **')) {
                      const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
                      if (match) {
                        return (
                          <div key={index} className="my-2 pl-4">
                            <p className="text-marketing-text-secondary">
                              <span className="text-white font-semibold">• {match[1]}</span>
                              {match[2] && `: ${match[2]}`}
                            </p>
                          </div>
                        );
                      }
                    }
                    if (trimmed.startsWith('- ')) {
                      return (
                        <p key={index} className="text-marketing-text-secondary my-2 pl-4">
                          • {trimmed.replace('- ', '')}
                        </p>
                      );
                    }
                    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                      return (
                        <p key={index} className="text-white font-semibold my-4">
                          {trimmed.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    
                    return (
                      <p key={index} className="text-marketing-text-secondary my-4 leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-12 pt-10 border-t border-white/10 marketing-card p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Ready to validate your email list?</h3>
                  <p className="text-marketing-text-secondary mb-6">
                    Start with 100 free credits and experience unlimited email validation with MailVet.
                  </p>
                  <Link to="/access?page=signup">
                    <Button className="marketing-cta font-semibold px-8">
                      Get Started Free
                    </Button>
                  </Link>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mt-16">
                    <h3 className="text-2xl font-semibold mb-8 text-white">Related Articles</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.slug}
                          to={`/blog/${relatedPost.slug}`}
                          className="block marketing-card overflow-hidden group"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={relatedPost.thumbnail}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-sm text-white group-hover:text-marketing-violet transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <span className="text-xs text-marketing-text-secondary mt-2 block">
                              {relatedPost.readTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
