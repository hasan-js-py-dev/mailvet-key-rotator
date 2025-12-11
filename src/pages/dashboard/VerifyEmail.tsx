import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ValidationResult {
  email: string;
  valid: boolean;
  code: number;
  message: string;
  domain: string;
  catch_all: boolean;
  risk_level: "low" | "medium" | "high";
}

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock result
    const isValid = !email.includes("invalid") && !email.includes("fake");
    const isCatchAll = email.includes("catchall");

    setResult({
      email,
      valid: isValid && !isCatchAll,
      code: isValid ? 200 : 400,
      message: isValid
        ? isCatchAll
          ? "Email domain accepts all addresses (catch-all)"
          : "Email is valid and deliverable"
        : "Email address is invalid or undeliverable",
      domain: email.split("@")[1] || "unknown",
      catch_all: isCatchAll,
      risk_level: isValid ? (isCatchAll ? "medium" : "low") : "high",
    });

    setIsLoading(false);

    toast({
      title: "Validation Complete",
      description: `Email ${email} has been validated.`,
    });
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.catch_all) return <AlertCircle className="w-8 h-8 text-yellow-500" />;
    if (result.valid) return <CheckCircle className="w-8 h-8 text-green-500" />;
    return <XCircle className="w-8 h-8 text-red-accent" />;
  };

  const getRiskBadge = (level: string) => {
    const styles = {
      low: "bg-green-500/10 text-green-600",
      medium: "bg-yellow-500/10 text-yellow-600",
      high: "bg-red-accent/10 text-red-accent",
    };
    return styles[level as keyof typeof styles];
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Verify Email</h1>
          <p className="text-muted-foreground">
            Enter an email address to validate it in real-time. Uses 1 credit per validation.
          </p>
        </div>

        {/* Validation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-8"
        >
          <form onSubmit={handleValidate} className="flex gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 text-lg"
                required
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="h-14 px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Validate
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center gap-4">
              {getStatusIcon()}
              <div>
                <h3 className="font-display text-xl font-semibold">
                  {result.catch_all
                    ? "Catch-All Detected"
                    : result.valid
                    ? "Valid Email"
                    : "Invalid Email"}
                </h3>
                <p className="text-muted-foreground">{result.message}</p>
              </div>
            </div>

            <div className="p-6 grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-mono">{result.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Domain</p>
                <p className="font-mono">{result.domain}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Response Code</p>
                <p className="font-mono">{result.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(result.risk_level)}`}>
                  {result.risk_level.charAt(0).toUpperCase() + result.risk_level.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Catch-All</p>
                <p>{result.catch_all ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Deliverable</p>
                <p>{result.valid ? "Yes" : "No"}</p>
              </div>
            </div>

            {/* JSON Response */}
            <div className="p-6 bg-dark border-t border-border">
              <p className="text-sm text-primary-foreground/70 mb-2">API Response</p>
              <pre className="text-sm font-mono text-primary-foreground/90 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
