import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Copy, RefreshCw, Eye, EyeOff, Check, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ApiToken() {
  const [showToken, setShowToken] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiToken = "mv_live_xK9j2mNpQrStUvWxYz1a2b3c4d5e6f7g8h9i0j";
  const maskedToken = "mv_live_" + "•".repeat(32);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiToken);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "API token copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegenerating(false);
    toast({
      title: "Token Regenerated",
      description: "Your new API token is ready. Update your integrations.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">API Token</h1>
          <p className="text-muted-foreground">
            Use this token to authenticate your API requests.
          </p>
        </div>

        {/* Token Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center">
              <Key className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Your API Token</h2>
              <p className="text-sm text-muted-foreground">Keep this token secure and never share it publicly.</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 flex items-center gap-4 mb-6">
            <code className="flex-1 font-mono text-sm break-all">
              {showToken ? apiToken : maskedToken}
            </code>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="gradient" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Token
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-600 mb-1">Security Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Never expose your API token in client-side code or public repositories</li>
                <li>• Store your token in environment variables or a secure secrets manager</li>
                <li>• Regenerate your token immediately if you suspect it has been compromised</li>
                <li>• Use HTTPS for all API requests to ensure encrypted communication</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Usage Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold">Usage Example</h2>
          </div>
          <div className="bg-dark p-6">
            <pre className="text-sm font-mono text-primary-foreground/90 overflow-x-auto">
              {`// Include your token in the Authorization header
fetch('https://api.mailvet.app/v1/verify-email', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${showToken ? apiToken : "mv_live_YOUR_API_TOKEN"}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});`}
            </pre>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
