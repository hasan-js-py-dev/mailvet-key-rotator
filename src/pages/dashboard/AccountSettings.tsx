import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Shield, 
  Bell, 
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Crown,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { getDashboardUrl, getMainSiteUrl } from "@/lib/subdomain";
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

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, refetch } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
  const sessionTokenKey = "mailvet_session";

  const getInternalPathOrUrl = (target: string): string => {
    try {
      const url = new URL(target, window.location.origin);
      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }
      return url.toString();
    } catch {
      return target;
    }
  };

  const planTo = getInternalPathOrUrl(getDashboardUrl("/plan"));

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

  const handleSaveProfile = async () => {
    const token = localStorage.getItem(sessionTokenKey);
    if (!token) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/account`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: `${firstName} ${lastName}`.trim(),
          companyName: companyName.trim() 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await refetch();
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setIsResettingPassword(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      toast({
        title: "Reset link sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem(sessionTokenKey);
    if (!token) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Clear session and redirect
      localStorage.removeItem(sessionTokenKey);
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      
      // Redirect to marketing site (smooth if same-origin)
      const target = getMainSiteUrl("/?accountDeleted=1");
      const internalOrUrl = getInternalPathOrUrl(target);

      if (internalOrUrl.startsWith("http")) {
        window.location.assign(internalOrUrl);
      } else {
        navigate(internalOrUrl, { replace: true });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'Pro Plan';
      case 'enterprise':
        return 'Enterprise Plan';
      default:
        return 'Free Plan';
    }
  };

  const isPaidPlan = user?.plan && user.plan !== 'free';

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg"
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-foreground text-xl font-semibold">
                {isUserLoading ? "..." : getInitials(user?.name || null, user?.email || "")}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name || "No name set"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    Email verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-500 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    Email not verified
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              {/* First Name Field */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="max-w-md"
                />
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="max-w-md"
                />
              </div>

              {/* Company Name Field */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="max-w-md"
                />
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="max-w-md bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>

              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                size="sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Subscription & Billing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg"
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">Subscription & Billing</h2>
                <p className="text-sm text-muted-foreground">Manage your plan and billing</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            {/* Current Plan */}
            <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPaidPlan ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Crown className={`w-5 h-5 ${isPaidPlan ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{getPlanDisplayName(user?.plan || 'free')}</p>
                  <p className="text-sm text-muted-foreground">
                    {isPaidPlan 
                      ? `Billing status: ${user?.billingStatus || 'Active'}`
                      : 'Unlimited email verifications'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={planTo}>
                  {isPaidPlan ? 'Manage Plan' : 'Upgrade'}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Credits Display */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Verification Credits</p>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === 'free' 
                    ? `${user?.credits ?? 100} credits remaining`
                    : 'Unlimited verifications'}
                </p>
              </div>
              {user?.plan === 'free' && (user?.credits ?? 100) < 20 && (
                <Button size="sm" asChild>
                  <Link to={planTo}>
                    Get More Credits
                  </Link>
                </Button>
              )}
            </div>

            {/* Billing History */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium text-foreground">Billing History</p>
              </div>
              
              {isPaidPlan ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded text-sm">
                    <span className="text-muted-foreground">
                      {user?.renewalDate 
                        ? `Next billing: ${new Date(user.renewalDate).toLocaleDateString()}`
                        : 'Active subscription'}
                    </span>
                    <span className="text-foreground font-medium capitalize">{user?.billingStatus || 'Active'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  No billing history. Upgrade to a paid plan to see invoices here.
                </p>
              )}
            </div>

            {/* Upgrade CTA for Free Users */}
            {!isPaidPlan && (
              <div className="border-t border-border pt-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Upgrade to Pro</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get unlimited list storage, faster processing, and upload up to 10,000 emails per list.
                      </p>
                      <Button size="sm" className="mt-3" asChild>
                        <Link to={planTo}>
                          View Plans
                          <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg"
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground">Manage your security settings</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Password</p>
                <p className="text-sm text-muted-foreground">Last changed: Unknown</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg"
        >
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Configure email preferences</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive tips, product updates and offers</p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-destructive/30 rounded-lg"
        >
          <div className="p-5 border-b border-destructive/30">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <h2 className="font-semibold text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground">Irreversible actions</p>
              </div>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
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
                      account and remove all your data from our servers.
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