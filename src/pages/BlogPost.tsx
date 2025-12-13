import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Linkedin, Twitter } from "lucide-react";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug || "");
  const relatedPosts = getRelatedPosts(slug || "", 3);
  
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
                {/* Breadcrumb */}
                <Link 
                  to="/blog" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>

                {/* Hero Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
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

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 mb-10 pb-10 border-b border-border/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share:
                  </span>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:border-cyan/50 hover:text-cyan transition-all"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-8 h-8 rounded-full bg-card/50 border border-border/30 flex items-center justify-center hover:border-cyan/50 hover:text-cyan transition-all"
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
                        <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-foreground">
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-semibold mt-8 mb-3 text-foreground">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('| ')) {
                      // Simple table rendering
                      return (
                        <div key={index} className="overflow-x-auto my-4">
                          <pre className="text-sm text-muted-foreground bg-card/30 p-4 rounded-lg">
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
                          <input type="checkbox" checked={isChecked} readOnly className="accent-cyan" />
                          <span className="text-muted-foreground">{text}</span>
                        </div>
                      );
                    }
                    if (/^\d+\. \*\*/.test(trimmed)) {
                      const match = trimmed.match(/^(\d+)\. \*\*(.+?)\*\*:?\s*(.*)$/);
                      if (match) {
                        return (
                          <div key={index} className="my-3">
                            <p className="text-muted-foreground">
                              <span className="text-foreground font-semibold">{match[1]}. {match[2]}</span>
                              {match[3] && `: ${match[3]}`}
                            </p>
                          </div>
                        );
                      }
                    }
                    if (/^\d+\. /.test(trimmed)) {
                      return (
                        <p key={index} className="text-muted-foreground my-2 pl-4">
                          {trimmed}
                        </p>
                      );
                    }
                    if (trimmed.startsWith('- **')) {
                      const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
                      if (match) {
                        return (
                          <div key={index} className="my-2 pl-4">
                            <p className="text-muted-foreground">
                              <span className="text-foreground font-semibold">• {match[1]}</span>
                              {match[2] && `: ${match[2]}`}
                            </p>
                          </div>
                        );
                      }
                    }
                    if (trimmed.startsWith('- ')) {
                      return (
                        <p key={index} className="text-muted-foreground my-2 pl-4">
                          • {trimmed.replace('- ', '')}
                        </p>
                      );
                    }
                    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                      return (
                        <p key={index} className="text-foreground font-semibold my-4">
                          {trimmed.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    
                    return (
                      <p key={index} className="text-muted-foreground my-4 leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-12 pt-10 border-t border-border/30 bg-gradient-to-r from-cyan/5 to-transparent rounded-xl p-8">
                  <h3 className="text-2xl font-semibold mb-4">Ready to validate your email list?</h3>
                  <p className="text-muted-foreground mb-6">
                    Start with 100 free credits and experience unlimited email validation with MailVet.
                  </p>
                  <Link to="/access?page=signup">
                    <Button className="bg-cyan hover:bg-cyan/90 text-background font-semibold px-8">
                      Get Started Free
                    </Button>
                  </Link>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mt-16">
                    <h3 className="text-2xl font-semibold mb-8">Related Articles</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.slug}
                          to={`/blog/${relatedPost.slug}`}
                          className="block bg-card/50 border border-border/30 rounded-xl overflow-hidden hover:border-cyan/30 transition-all group"
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
                            <h4 className="font-semibold text-sm group-hover:text-cyan transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <span className="text-xs text-muted-foreground mt-2 block">
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
