import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Mail, 
  AlertTriangle, 
  Inbox,
  Copy,
} from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

interface ValidationResult {
  email: string;
  valid: boolean;
  code: string;
  message: string;
  domain: string;
  catch_all: boolean;
  risk_level: "low" | "medium" | "high";
  mx_records: boolean;
  disposable: boolean;
  role_based: boolean;
}

const categories = [
  {
    icon: CheckCircle,
    title: "Valid",
    description: "The email address exists and is deliverable.",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-500/10",
  },
  {
    icon: AlertCircle,
    title: "Catch-all",
    description: "The domain accepts all emails. Delivery is uncertain.",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    icon: XCircle,
    title: "Invalid",
    description: "The email address does not exist or is undeliverable.",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Disposable",
    description: "Temporary email addresses that expire after use.",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
  },
  {
    icon: Mail,
    title: "Role-based",
    description: "Generic addresses like info@, support@, admin@.",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    icon: Inbox,
    title: "MX Records",
    description: "Whether the domain has valid mail exchange records.",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
  },
];

export default function SingleEmail() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { user, refetch } = useUser();
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${apiBaseUrl}/v1/validation/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Validation failed");
      }

      const data = await response.json();
      setResult({
        email: data.email,
        valid: data.code === "ok",
        code: data.code,
        message: data.message,
        domain: email.split("@")[1] || "unknown",
        catch_all: data.catchAll || false,
        risk_level: data.riskLevel || "low",
        mx_records: data.mxRecords !== false,
        disposable: data.disposable || false,
        role_based: data.roleBased || false,
      });

      await refetch(); // Refresh user credits
      toast({ title: "Validation Complete", description: `Email ${email} has been validated.` });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : "Failed to validate email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.catch_all) return <AlertCircle className="w-6 h-6 text-amber-500" />;
    if (result.valid) return <CheckCircle className="w-6 h-6 text-green-600" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const handleTryExample = () => {
    setEmail("tim.cook@apple.com");
  };

  return (
    <TopNavLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Email Verification</h1>
            <p className="text-muted-foreground">
              Verify email addresses from people and companies.
            </p>
          </div>
        </div>

        {/* Validation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <form onSubmit={handleValidate} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Copy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Full name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="h-12 px-6 gap-2 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Find
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Not inspired?{" "}
              <button
                type="button"
                onClick={handleTryExample}
                className="text-primary hover:underline"
              >
                Try it with Tim Cook from Apple
              </button>
            </p>
          </form>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center gap-4">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {result.catch_all
                    ? "Catch-All Detected"
                    : result.valid
                    ? "Valid Email"
                    : "Invalid Email"}
                </h3>
                <p className="text-muted-foreground">{result.message}</p>
              </div>
            </div>

            <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-mono text-sm text-foreground">{result.email}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Domain</p>
                <p className="font-mono text-sm text-foreground">{result.domain}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">MX Records</p>
                <p className="text-sm text-foreground">{result.mx_records ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Catch-All</p>
                <p className="text-sm text-foreground">{result.catch_all ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Disposable</p>
                <p className="text-sm text-foreground">{result.disposable ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Role-Based</p>
                <p className="text-sm text-foreground">{result.role_based ? "Yes" : "No"}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Types of Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Types of Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </TopNavLayout>
  );
}
