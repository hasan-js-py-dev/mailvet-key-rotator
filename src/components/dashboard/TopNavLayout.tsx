import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  Mail,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  CreditCard,
  User,
  Key,
  Gauge,
  HelpCircle,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/components/AuthProvider";
import { Logo } from "@/components/Logo";

const mainNavItems = [
  { icon: Mail, label: "Single", path: "/dashboard/verify-email" },
  { icon: List, label: "Lists", path: "/dashboard/lists" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports" },
];

// Additional paths to check for active state
const listsPaths = ["/dashboard/lists", "/dashboard/verify-list"];
const singlePaths = ["/dashboard/verify-email", "/dashboard/single-email"];

interface TopNavLayoutProps {
  children: React.ReactNode;
}

export const TopNavLayout = ({ children }: TopNavLayoutProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { logout } = useAuthContext();

  const handleSignOut = async () => {
    await logout();
    navigate("/access");
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

  const getPlanLabel = (plan: string | undefined) => {
    switch (plan) {
      case "free":
        return "Free";
      case "ultimate":
      case "enterprise":
        return "Paid";
      default:
        return "Free";
    }
  };

  const credits = user?.credits ?? 0;

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-background to-muted/30">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75 border-b border-border h-14">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {mainNavItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/dashboard/lists" && listsPaths.includes(location.pathname)) ||
                (item.path === "/dashboard/verify-email" && singlePaths.includes(location.pathname));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link to="/dashboard/plan">
              <Button variant="gradient" size="sm" className="rounded-full">
                Upgrade
              </Button>
            </Link>
          </nav>

          {/* Right: Credits + User Menu */}
          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>{credits} credits left</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                {isLoading ? (
                  <Skeleton className="w-8 h-8 rounded-full" />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-xs border border-border">
                      {getInitials(user?.name, user?.email)}
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform hidden sm:block",
                      userMenuOpen && "rotate-180"
                    )} />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-border">
                        <p className="font-medium text-foreground truncate">
                          {user?.name || user?.email?.split("@")[0] || "User"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {getPlanLabel(user?.plan)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {credits} emails left
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/dashboard/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          to="/dashboard/settings?tab=billing"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Billing</span>
                        </Link>
                        <Link
                          to="/dashboard/plan"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Upgrade</span>
                        </Link>
                        <a
                          href="mailto:support@mailvet.app"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Support</span>
                        </a>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-border py-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-card"
            >
              <nav className="p-4 space-y-1">
                {mainNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-2">
                  <Link to="/dashboard/plan" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="gradient" className="w-full justify-center rounded-lg">
                      Upgrade
                    </Button>
                  </Link>
                </div>

                <div className="pt-2 border-t border-border mt-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>{credits} credits left</span>
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-14 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
