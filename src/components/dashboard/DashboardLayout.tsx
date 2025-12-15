import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Mail,
  FileSpreadsheet,
  BarChart3,
  CreditCard,
  Key,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Mail, label: "Verify Email", path: "/dashboard/verify-email" },
  { icon: FileSpreadsheet, label: "Verify List", path: "/dashboard/verify-list" },
  { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
  { icon: CreditCard, label: "Plan & Billing", path: "/dashboard/plan" },
  { icon: Key, label: "API Token", path: "/dashboard/api-token" },
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

  const handleSignOut = () => {
    localStorage.removeItem("mailvet_session");
    navigate("/access?page=login");
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border h-16 px-4 flex items-center justify-between">
        <Logo size="sm" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-border">
            <Logo size="md" />
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "gradient-bg text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            {/* User Profile Card */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  userMenuOpen ? "bg-muted" : "bg-muted/50 hover:bg-muted"
                )}
              >
                {isLoading ? (
                  <>
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {getInitials(user?.name, user?.email)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium truncate text-sm">
                        {user?.name || "No name set"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {truncateEmail(user?.email)}
                      </p>
                    </div>
                    {userMenuOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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
                    <div className="pt-2 space-y-1">
                      <Link
                        to="/dashboard/account-settings"
                        onClick={() => {
                          setSidebarOpen(false);
                          setUserMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
                          location.pathname === "/dashboard/account-settings"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign out button when menu is collapsed */}
            {!userMenuOpen && (
              <button
                onClick={handleSignOut}
                className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
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
