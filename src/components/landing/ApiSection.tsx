import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const endpoints = [
  { method: "POST", path: "/v1/auth/signup", description: "Create a new account" },
  { method: "POST", path: "/v1/auth/login", description: "Authenticate user" },
  { method: "POST", path: "/v1/verify-email", description: "Validate single email" },
  { method: "POST", path: "/v1/verify-list", description: "Upload CSV for bulk validation" },
  { method: "GET", path: "/v1/jobs/{id}", description: "Check bulk job status" },
  { method: "GET", path: "/v1/plans", description: "List available plans" },
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
console.log(result);

// Response:
// {
//   "valid": true,
//   "code": 200,
//   "message": "Email is valid and deliverable",
//   "domain": "example.com",
//   "catch_all": false
// }`;

export const ApiSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Developer-First</span> API
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful REST API. Integrate email validation in minutes with comprehensive documentation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Endpoints list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-2xl font-semibold mb-6">API Endpoints</h3>
            <div className="space-y-3">
              {endpoints.map((endpoint, index) => (
                <div
                  key={endpoint.path}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                      endpoint.method === "POST"
                        ? "bg-green-500/10 text-green-600"
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
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl font-semibold">Quick Start (Node.js)</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="gradient-border rounded-xl p-1">
              <div className="bg-dark rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">verify-email.js</span>
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm font-mono text-primary-foreground/90 leading-relaxed">
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
