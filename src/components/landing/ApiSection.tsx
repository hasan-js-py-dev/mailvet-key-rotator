import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const endpoints = [
  { method: "POST", path: "/v1/auth/signup", description: "Create account" },
  { method: "POST", path: "/v1/auth/login", description: "Authenticate" },
  { method: "POST", path: "/v1/verify-email", description: "Validate email" },
  { method: "POST", path: "/v1/verify-list", description: "Bulk validation" },
  { method: "GET", path: "/v1/jobs/{id}", description: "Job status" },
  { method: "GET", path: "/v1/plans", description: "List plans" },
];

const codeExample = `const response = await fetch('https://api.mailvet.app/v1/verify-email', {
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
// { "valid": true, "code": 200, "message": "Email is valid" }`;

export const ApiSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-overline text-accent mb-4">API</p>
          <h2 className="font-display font-bold mb-5">
            <span className="gradient-text">Developer-First</span> API
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful REST API. Integrate email validation in minutes with comprehensive documentation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
          {/* Endpoints list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display text-xl font-semibold mb-6 text-foreground">API Endpoints</h3>
            <div className="space-y-3">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
                >
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold ${
                      endpoint.method === "POST"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue/10 text-blue"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Code example */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground">Quick Start</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-bg rounded-xl blur-xl opacity-10" />
              <div className="relative gradient-border rounded-xl overflow-hidden">
                <div className="bg-background rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">verify-email.js</span>
                  </div>
                  <pre className="p-5 overflow-x-auto">
                    <code className="text-sm font-mono text-foreground/90 leading-relaxed">
                      {codeExample}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
