import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Mail,
  List,
  Shield,
  Zap,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/components/AuthProvider";

const navItems = [
  { icon: Upload, label: "Bulk Upload", path: "/dashboard/verify-list" },
  { icon: Mail, label: "Single Email", path: "/dashboard/verify-email" },
  { icon: List, label: "Recent Lists", path: "/dashboard/reports" },
  { icon: Shield, label: "Catch-all", path: "/dashboard/catch-all" },
  { icon: Zap, label: "Upgrade", path: "/dashboard/plan" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { logout } = useAuthContext();

  const handleSignOut = async () => {
    await logout();
  };

  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const truncateEmail = (email: string | undefined, maxLength: number = 20) => {
    if (!email) return "";
    if (email.length <= maxLength) return email;
    return email.slice(0, maxLength) + "...";
  };

  const currentPlan = "Free Plan";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 px-4 flex items-center justify-between">
        <span className="font-bold text-xl text-foreground">MailVet</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-52 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-14 px-5 flex items-center border-b border-border">
          <span className="font-bold text-xl text-foreground">MailVet</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-3">
          {/* User Account Button */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm",
                userMenuOpen ? "bg-muted" : "hover:bg-muted"
              )}
            >
              {isLoading ? (
                <>
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-xs">
                    {getInitials(user?.name, user?.email)}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium truncate text-foreground text-sm">
                      {user?.name || "My Account"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentPlan}
                    </p>
                  </div>
                  {userMenuOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </>
              )}
            </button>

            {/* Expandable Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1 space-y-1">
                    <Link
                      to="/dashboard/account-settings"
                      onClick={() => {
                        setSidebarOpen(false);
                        setUserMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                        location.pathname === "/dashboard/account-settings"
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upgrade Button */}
          <Button
            onClick={() => navigate("/dashboard/plan")}
            className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 justify-between"
            size="sm"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Upgrade to Pro</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-52 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-6xl">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};