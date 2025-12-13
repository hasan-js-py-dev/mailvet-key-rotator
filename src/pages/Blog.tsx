import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Email Validation Blog - Tips, Guides & Best Practices | MailVet</title>
        <meta name="description" content="Expert insights on email validation, deliverability, and list hygiene. Learn best practices to improve your email marketing success with MailVet's comprehensive guides." />
        <meta name="keywords" content="email validation blog, email verification guide, email deliverability tips, email list hygiene, reduce bounce rate, spam trap prevention" />
        <link rel="canonical" href="https://mailvet.app/blog" />
        <meta property="og:title" content="Email Validation Blog - Tips, Guides & Best Practices | MailVet" />
        <meta property="og:description" content="Expert insights on email validation, deliverability, and list hygiene. Learn best practices to improve your email marketing success." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mailvet.app/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "MailVet Email Validation Blog",
            "description": "Expert insights on email validation, deliverability, and list hygiene",
            "url": "https://mailvet.app/blog",
            "publisher": {
              "@type": "Organization",
              "name": "MailVet",
              "url": "https://mailvet.app"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center mb-12"
              >
                <span className="text-cyan text-sm font-medium tracking-wider uppercase">Resources</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                  Email Validation Blog
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Expert insights, guides, and best practices for email validation and deliverability.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles by title, topic, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 bg-card/50 border-border/30 focus:border-cyan/50"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-cyan text-background"
                          : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/30"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Results Count */}
              <div className="max-w-6xl mx-auto mb-8">
                <p className="text-muted-foreground text-sm">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Blog Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="block bg-card/50 border border-border/30 rounded-xl overflow-hidden h-full hover:border-cyan/30 transition-all duration-300 group"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={post.thumbnail} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-xs font-medium text-cyan bg-cyan/10 backdrop-blur-sm px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-6">
                        <h2 className="text-lg font-semibold mb-3 group-hover:text-cyan transition-colors line-clamp-2">
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
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground text-lg mb-4">
                    No articles found matching your search.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="text-cyan hover:underline"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
