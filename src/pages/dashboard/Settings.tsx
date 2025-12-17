import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  CreditCard,
  Key,
  Gauge,
  Loader2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  Trash2,
} from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { logout as authLogout, authenticatedFetch } from "@/lib/auth";
import { getDashboardUrl, getMainSiteUrl } from "@/lib/subdomain";
import { cn } from "@/lib/utils";

type TabType = "account" | "billing" | "api" | "limits";

const tabs: { id: TabType; label: string; icon: typeof User }[] = [
  { id: "account", label: "Account details", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API keys", icon: Key },
  { id: "limits", label: "Limits", icon: Gauge },
];

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || "account");
  
  const { user, isLoading: isUserLoading, refetch } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // API Token state
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  useEffect(() => {
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    }

    if (user?.companyName !== undefined) {
      setCompanyName(user.companyName || "");
    }
  }, [user]);

  const smartNavigateTo = (
    target: string,
    options: { replace?: boolean; delayMs?: number } = {}
  ) => {
    const { replace = false, delayMs = 0 } = options;

    const doNavigate = () => {
      try {
        const url = new URL(target, window.location.origin);
        if (url.origin === window.location.origin) {
          navigate(url.pathname + url.search + url.hash, { replace });
          return;
        }
        window.location.assign(url.toString());
      } catch {
        if (target.startsWith("/")) {
          navigate(target, { replace });
        } else {
          window.location.assign(target);
        }
      }
    };

    if (delayMs > 0) {
      window.setTimeout(doNavigate, delayMs);
      return;
    }

    doNavigate();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/account`, {
        method: "PATCH",
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          companyName: companyName.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message =
          typeof data?.error === "string"
            ? data.error
            : Array.isArray(data?.errors)
              ? data.errors?.[0]?.msg
              : null;
        throw new Error(message || "Failed to update profile");
      }

      await refetch();
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToken = () => {
    const token = "mv_live_xxxxxxxxxxxxxxxxxxxxx";
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast({ title: "Copied!", description: "API token copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateToken = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/account/api-token`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to regenerate token");
      await refetch();
      toast({ title: "Token Regenerated", description: "Your new API token is ready." });
    } catch {
      toast({ title: "Error", description: "Failed to regenerate token.", variant: "destructive" });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRequestPasswordChange = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (!response.ok) throw new Error("Failed to send reset email");
      toast({ title: "Email sent", description: `Password reset link sent to ${user.email}` });
    } catch {
      toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/account`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to delete account");
      }

      toast({ title: "Account deleted", description: "Your account has been deleted." });

      // Logout and redirect after successful deletion
      await authLogout();
      smartNavigateTo(getMainSiteUrl("/"), { replace: true, delayMs: 350 });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete account.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const credits = user?.credits ?? 0;
  const totalCredits = user?.plan === "pro" ? 10000 : user?.plan === "ultimate" ? 50000 : 100;
  const usagePercent = Math.min((credits / totalCredits) * 100, 100);
  const maskedToken = "mv_live_" + "•".repeat(24);

  return (
    <TopNavLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "pb-4 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Profile Form */}
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="max-w-md bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact us at support@mailvet.app if you need to change your email address.
                  </p>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update profile"
                  )}
                </Button>
              </div>

              {/* Password Section */}
              <div className="border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Update password</h2>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Request password update</p>
                  <p className="text-sm text-muted-foreground">
                    You will receive a link at {user?.email} with instructions on how to change your password.
                  </p>
                  <Button variant="outline" onClick={handleRequestPasswordChange} className="mt-2">
                    Request change
                  </Button>
                </div>
              </div>

              {/* Danger Zone - Delete Account */}
              <div className="border-t border-destructive/30 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers including validation
                            history, API tokens, and billing information.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Account"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Current Plan */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.plan === "free" ? "Free Trial" : `${user?.plan?.charAt(0).toUpperCase()}${user?.plan?.slice(1)} Plan`}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => smartNavigateTo(getDashboardUrl("/plan"))}>
                    Upgrade
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits used</span>
                    <span className="text-foreground">{totalCredits - credits} / {totalCredits}</span>
                  </div>
                  <Progress value={100 - usagePercent} className="h-2" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
                <Button variant="outline" className="mt-4">
                  Add payment method
                </Button>
              </div>

              {/* Billing History */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Billing History</h3>
                <p className="text-sm text-muted-foreground">No billing history yet.</p>
              </div>
            </motion.div>
          )}

          {activeTab === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">Your API Key</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use this key to authenticate API requests. Keep it secure and never share publicly.
                </p>

                <div className="bg-muted rounded-lg p-4 flex items-center gap-4 mb-4">
                  <code className="flex-1 font-mono text-sm break-all text-foreground">
                    {showToken ? maskedToken : maskedToken}
                  </code>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowToken(!showToken)}>
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCopyToken}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleCopyToken}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Key
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleRegenerateToken} disabled={isRegenerating}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", isRegenerating && "animate-spin")} />
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                </div>
              </div>

              {/* Usage Example */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Usage Example</h3>
                </div>
                <div className="bg-zinc-950 p-4">
                  <pre className="text-sm font-mono text-zinc-300 overflow-x-auto">
{`curl -X POST https://api.mailvet.app/v1/verify-email \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@example.com"}'`}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "limits" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Usage Limits</h3>
                
                <div className="space-y-6">
                  {/* Credits */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Email Validations</span>
                      <span className="text-foreground font-medium">{credits} / {totalCredits}</span>
                    </div>
                    <Progress value={usagePercent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Resets on {user?.renewalDate ? new Date(user.renewalDate).toLocaleDateString() : "next billing cycle"}
                    </p>
                  </div>

                  {/* API Rate Limit */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">API Rate Limit</span>
                      <span className="text-foreground font-medium">
                        {user?.plan === "enterprise" ? "Unlimited" : user?.plan === "ultimate" ? "100/sec" : "10/sec"}
                      </span>
                    </div>
                  </div>

                  {/* Bulk Upload Limit */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Max Emails per List</span>
                      <span className="text-foreground font-medium">
                        {user?.plan === "enterprise" ? "Unlimited" : user?.plan === "ultimate" ? "100,000" : user?.plan === "pro" ? "10,000" : "1,000"}
                      </span>
                    </div>
                  </div>

                  {/* Lists Storage */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Recent Lists Storage</span>
                      <span className="text-foreground font-medium">
                        {user?.plan === "free" ? "4 lists" : "Unlimited"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Need higher limits?
                </p>
                <Button onClick={() => smartNavigateTo(getDashboardUrl("/plan"))}>
                  Upgrade your plan
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TopNavLayout>
  );
}
