import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, Globe, AtSign, ShieldCheck } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authenticatedFetch } from "@/lib/auth";
import { cn } from "@/lib/utils";

type VerifyResult = "valid" | "catch-all" | "invalid" | "no-mx records" | "timeout";

interface VerifyEmailResponse {
  email: string;
  result: VerifyResult;
  code: string;
  message: string;
  riskLevel: "low" | "medium" | "high" | "unknown";
  addressInfo: {
    canonicalAddress: string;
    roleBased: boolean;
    mailboxExists: boolean;
    smtpCheck: boolean;
    disposableAddress: boolean;
  };
  domainInfo: {
    domain: string;
    mxRecordsFound: boolean;
    mxRecords: Array<{ exchange: string; priority: number }>;
    domainProvider: string | null;
    catchAllDomain: boolean;
    disposableDomain: boolean;
  };
  verifiedAt: string;
  creditsRemaining: number | "unlimited";
}

const prettyResult = (value: VerifyResult) => {
  switch (value) {
    case "valid":
      return "Valid";
    case "catch-all":
      return "Catch-all";
    case "invalid":
      return "Invalid";
    case "no-mx records":
      return "No MX records";
    case "timeout":
      return "Timeout";
    default:
      return value;
  }
};

const badgeClass = (value: VerifyResult) => {
  if (value === "valid") return "bg-green-500/10 text-green-600 border-green-500/30";
  if (value === "catch-all") return "bg-amber-500/10 text-amber-600 border-amber-500/30";
  if (value === "invalid") return "bg-red-500/10 text-red-600 border-red-500/30";
  if (value === "no-mx records") return "bg-purple-500/10 text-purple-600 border-purple-500/30";
  return "bg-zinc-500/10 text-zinc-600 border-zinc-500/30";
};

const statusIcon = (value: VerifyResult) => {
  if (value === "valid") return <CheckCircle className="w-6 h-6 text-green-600" />;
  if (value === "catch-all") return <AlertCircle className="w-6 h-6 text-amber-500" />;
  if (value === "no-mx records") return <Globe className="w-6 h-6 text-purple-600" />;
  if (value === "timeout") return <ShieldCheck className="w-6 h-6 text-zinc-600" />;
  return <XCircle className="w-6 h-6 text-red-500" />;
};

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyEmailResponse | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  const canSubmit = useMemo(() => email.trim().length > 3 && email.includes("@"), [email]);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/verify-email`, {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await response.json().catch(() => null)) as VerifyEmailResponse | { error?: string; message?: string } | null;

      if (!response.ok) {
        const message =
          data && typeof (data as any).message === "string"
            ? (data as any).message
            : data && typeof (data as any).error === "string"
              ? (data as any).error
              : "Failed to validate email";
        throw new Error(message);
      }

      setResult(data as VerifyEmailResponse);
      toast({
        title: "Verified",
        description: `${email.trim()} checked successfully.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to validate email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Single Email</h1>
          <p className="text-muted-foreground">Instantly verify deliverability, domain health, and risk signals.</p>
        </div>

        {/* Validation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Verify an email</h2>
                <p className="text-sm text-muted-foreground">Enter an email address to validate.</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleValidate} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Email address (e.g. amyb@antiochfc.org)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !canSubmit}
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
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">{statusIcon(result.result)}</div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-foreground">
                    {result.email}
                    <span className={cn("ml-2 align-middle inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", badgeClass(result.result))}>
                      {prettyResult(result.result)}
                    </span>
                  </h3>
                  <p className="text-muted-foreground">{result.message || "—"}</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <AtSign className="w-4 h-4" />
                <span>Verified at {new Date(result.verifiedAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-6 grid gap-6 lg:grid-cols-2">
              {/* Address Info */}
              <div className="rounded-xl border border-border bg-muted/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AtSign className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-semibold text-foreground">Address Info</h4>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">Canonical address</p>
                    <p className="mt-1 font-mono text-sm text-foreground">{result.addressInfo.canonicalAddress || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">Role based address</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.addressInfo.roleBased ? "Yes" : "No"}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">Mailbox exists</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.addressInfo.mailboxExists ? "Yes" : "No"}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">SMTP check</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.addressInfo.smtpCheck ? "Yes" : "No"}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-4 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Disposable address</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.addressInfo.disposableAddress ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              {/* Domain Info */}
              <div className="rounded-xl border border-border bg-muted/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-semibold text-foreground">Domain Info</h4>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-card border border-border p-4 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Domain</p>
                    <p className="mt-1 font-mono text-sm text-foreground">{result.domainInfo.domain}</p>
                  </div>

                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">MX records</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {result.domainInfo.mxRecordsFound ? "Found" : "Not found"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">Domain provider</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.domainInfo.domainProvider || "—"}</p>
                  </div>

                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">Catch-all domain</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.domainInfo.catchAllDomain ? "Yes" : "No"}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-4">
                    <p className="text-xs text-muted-foreground">Disposable domain</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{result.domainInfo.disposableDomain ? "Yes" : "No"}</p>
                  </div>

                  {result.domainInfo.mxRecordsFound && result.domainInfo.mxRecords?.length > 0 && (
                    <div className="rounded-lg bg-card border border-border p-4 sm:col-span-2">
                      <p className="text-xs text-muted-foreground">MX record details</p>
                      <div className="mt-2 space-y-1">
                        {result.domainInfo.mxRecords.slice(0, 5).map((mx) => (
                          <div key={`${mx.exchange}-${mx.priority}`} className="flex items-center justify-between text-sm">
                            <span className="font-mono text-foreground truncate">{mx.exchange}</span>
                            <span className="text-muted-foreground">priority {mx.priority}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}