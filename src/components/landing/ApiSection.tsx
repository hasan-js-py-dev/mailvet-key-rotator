import { motion } from "framer-motion";
import { Copy, Check, Terminal, Book, Puzzle, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Terminal,
    title: "Simple REST API",
    description: "Clean, intuitive endpoints that follow REST best practices. Get started in minutes.",
  },
  {
    icon: Book,
    title: "Comprehensive Docs",
    description: "Detailed documentation with examples in multiple languages including Node.js, Python, PHP.",
  },
  {
    icon: Puzzle,
    title: "Easy Integration",
    description: "SDKs for popular frameworks. Seamless integration with your existing workflow.",
  },
  {
    icon: Zap,
    title: "Webhooks Support",
    description: "Real-time notifications for bulk validation jobs. Never miss a completion event.",
  },
];

const codeExample = `// Validate a single email address
const response = await fetch('https://api.mailvet.app/v1/verify-email', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});

const result = await response.json();

// Response
{
  "email": "user@example.com",
  "valid": true,
  "result": {
    "code": 200,
    "message": "Email is valid and deliverable",
    "risk_level": "low"
  }
}`;

export const ApiSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-cyan mb-4">For Developers</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Powerful Email Validation{" "}
            <span className="gradient-text">API</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integrate email validation into your applications with our developer-friendly REST API. 
            Built for reliability and speed at any scale.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-5 rounded-xl border border-border/30 bg-card/30 hover:border-cyan/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-cyan" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/access?page=signup">
                <Button size="lg" className="bg-cyan hover:bg-cyan/90 text-background font-semibold w-full sm:w-auto">
                  Get API Key
                </Button>
              </Link>
              <a href="#api">
                <Button size="lg" variant="outline" className="border-border/50 hover:bg-card w-full sm:w-auto">
                  View Documentation
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Code example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan/10 rounded-xl blur-xl opacity-20" />
              <div className="relative rounded-xl border border-border/30 overflow-hidden bg-background">
                <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between bg-card/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-2">verify-email.js</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 px-2 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-5 overflow-x-auto text-sm">
                  <code className="font-mono text-foreground/90 leading-relaxed whitespace-pre">
                    {codeExample}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};