import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Key,
  CreditCard,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
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
  const { user, isLoading: isUserLoading, refetch } = useUser();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
  const sessionTokenKey = "mailvet_session";

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
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
        body: JSON.stringify({ name }),
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

  const handleDeleteAccount = async () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
    });
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

  const sections = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      description: "Manage your personal information",
    },
    {
      id: "security",
      icon: Shield,
      title: "Security",
      description: "Password and authentication settings",
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      description: "Email notification preferences",
    },
    {
      id: "billing",
      icon: CreditCard,
      title: "Billing",
      description: "Manage your subscription",
    },
  ];

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
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={name || user?.name || ""}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
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

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              <Button variant="outline" size="sm">
                Change Password
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

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">API Token</p>
                  <p className="text-sm text-muted-foreground">Manage your API access</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/api-token">
                    <Key className="w-4 h-4 mr-2" />
                    Manage
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
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