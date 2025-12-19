import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  CreditCard,
  Gauge,
  Loader2,
  Trash2,
} from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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

type TabType = "account" | "billing" | "limits";

const tabs: { id: TabType; label: string; icon: typeof User }[] = [
  { id: "account", label: "Account details", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "limits", label: "Limits", icon: Gauge },
];

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get("tab");

  const isValidTab = (value: string | null): value is TabType => {
    return value === "account" || value === "billing" || value === "limits";
  };

  const [activeTab, setActiveTab] = useState<TabType>(
    isValidTab(tabParam) ? tabParam : "account"
  );
  
  const { user, isLoading: isUserLoading, refetch } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isCancellingPlan, setIsCancellingPlan] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  useEffect(() => {
    if (isValidTab(tabParam)) {
      setActiveTab(tabParam);
      return;
    }

    // If an invalid tab is present (e.g. legacy 'api'), fall back to account.
    if (tabParam) {
      setActiveTab("account");
      setSearchParams({ tab: "account" });
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


  const handleRequestPasswordChange = async () => {
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/account/password-reset`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send reset email");
      }

      toast({
        title: "Email sent",
        description: "Password reset instructions have been sent to your email address.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to send reset email.",
        variant: "destructive",
      });
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
  const isPaid = user?.plan !== "free" && user?.billingStatus === "active";
  const totalCredits = isPaid ? null : 100;
  const usagePercent = totalCredits ? Math.min((credits / totalCredits) * 100, 100) : 0;

  const planLabel = (() => {
    if (!user?.plan) return "Free";
    if (user.plan === "ultimate") return "Ultimate";
    if (user.plan === "enterprise") return "Enterprise";
    return "Free";
  })();

  const billingStatusLabel = (() => {
    const status = user?.billingStatus || "none";
    if (user?.plan === "free" && status === "none") return "Free";
    if (status === "active") return "Active";
    if (status === "cancelled") return "Cancelled";
    if (status === "past_due") return "Past due";
    return "None";
  })();

  const billingStatusBadgeClass = (() => {
    const status = user?.billingStatus || "none";
    if (user?.plan === "free" && status === "none") {
      return "bg-muted text-muted-foreground border-border";
    }
    if (status === "active") return "bg-green-500/10 text-green-600 border-green-500/30";
    if (status === "past_due") return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    if (status === "cancelled") return "bg-zinc-500/10 text-zinc-600 border-zinc-500/30";
    return "bg-muted text-muted-foreground border-border";
  })();

  const formatDate = (value?: string | Date | null) => {
    if (!value) return null;
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString();
  };

  const handleCancelPlan = async () => {
    if (isCancellingPlan) return;

    setIsCancellingPlan(true);
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/billing/cancel`, {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to cancel plan");
      }

      toast({
        title: "Plan cancelled",
        description: "You are now on the Free plan.",
      });
      await refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to cancel plan.",
        variant: "destructive",
      });
    } finally {
      setIsCancellingPlan(false);
    }
  };

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
                {user?.authMethod === "google" ? (
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      You signed in with Google, so your password is managed by your Google account.
                      To change your password, visit your{" "}
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google account security settings
                      </a>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Request password update</p>
                    <p className="text-sm text-muted-foreground">
                      You will receive a link at {user?.email} with instructions on how to change your password.
                    </p>
                    <Button variant="outline" onClick={handleRequestPasswordChange} className="mt-2">
                      Request change
                    </Button>
                  </div>
                )}
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
                            history and billing information.
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
              {/* Subscription */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Billing</h3>
                    <p className="text-sm text-muted-foreground">Manage your plan and subscription status.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => smartNavigateTo(getDashboardUrl("/plan"))}>
                      Upgrade 🚀
                    </Button>

                    {user?.plan !== "free" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" disabled={isCancellingPlan}>
                            Cancel plan
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel your plan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will switch your account back to the Free plan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep plan</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelPlan}
                              disabled={isCancellingPlan}
                            >
                              {isCancellingPlan ? (
                                <span className="inline-flex items-center">
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Cancelling...
                                </span>
                              ) : (
                                "Cancel plan"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">Active plan</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{planLabel}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                          billingStatusBadgeClass
                        )}
                      >
                        {billingStatusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">Renews</p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {formatDate(user?.renewalDate) || (user?.plan === "free" ? "—" : "Not set")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Upgraded / updated</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatDate(user?.planUpdatedAt) || (user?.plan === "free" ? "—" : "Not set")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {isPaid ? "Unlimited" : `${credits} / 100`}
                    </p>
                    {!isPaid && (
                      <div className="mt-3">
                        <Progress value={usagePercent} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Billing History</h3>
                <p className="text-sm text-muted-foreground">—</p>
              </div>
            </motion.div>
          )}

          {activeTab === "limits" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="font-semibold text-foreground">Limits</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current usage limits for checks and uploads.
                  </p>
                </div>

                <div className="p-2">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Max rows per check</TableCell>
                        <TableCell className="text-right">10,000 rows</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Paid plan rate limit</TableCell>
                        <TableCell className="text-right">3 emails/sec</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Max concurrency</TableCell>
                        <TableCell className="text-right">2 files</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Max file size</TableCell>
                        <TableCell className="text-right">20 MB</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={() => smartNavigateTo(getDashboardUrl("/plan"))}>
                  Upgrade 🚀
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TopNavLayout>
  );
}
