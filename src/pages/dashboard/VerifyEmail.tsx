import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, CheckCircle, XCircle, AlertCircle, Loader2, Mail, Shield, AlertTriangle, Inbox } from "lucide-react";
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
    bgColor: "bg-green-50",
  },
  {
    icon: AlertCircle,
    title: "Catch-all",
    description: "The domain accepts all emails. Delivery is uncertain.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: XCircle,
    title: "Invalid",
    description: "The email address does not exist or is undeliverable.",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: AlertTriangle,
    title: "Disposable",
    description: "Temporary email addresses that expire after use.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Mail,
    title: "Role-based",
    description: "Generic addresses like info@, support@, admin@.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Inbox,
    title: "MX Records",
    description: "Whether the domain has valid mail exchange records.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

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
    const isDisposable = email.includes("temp") || email.includes("disposable");
    const isRoleBased = email.startsWith("info@") || email.startsWith("support@") || email.startsWith("admin@");

    setResult({
      email,
      valid: isValid && !isCatchAll && !isDisposable,
      code: isValid ? 200 : 400,
      message: isValid
        ? isCatchAll
          ? "Email domain accepts all addresses (catch-all)"
          : "Email is valid and deliverable"
        : "Email address is invalid or undeliverable",
      domain: email.split("@")[1] || "unknown",
      catch_all: isCatchAll,
      risk_level: isValid ? (isCatchAll ? "medium" : "low") : "high",
      mx_records: isValid,
      disposable: isDisposable,
      role_based: isRoleBased,
    });

    setIsLoading(false);

    toast({
      title: "Validation Complete",
      description: `Email ${email} has been validated.`,
    });
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.catch_all) return <AlertCircle className="w-6 h-6 text-amber-500" />;
    if (result.valid) return <CheckCircle className="w-6 h-6 text-green-600" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Single Email</h1>
        </div>

        {/* Validation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Enter Email Address</h2>
          
          <form onSubmit={handleValidate} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 px-6 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <ArrowUp className="w-4 h-4" />
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

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MailVet. All rights reserved.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}