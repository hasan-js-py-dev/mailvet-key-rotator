import { motion } from "framer-motion";
import { 
  CreditCard, 
  Zap, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { 
    label: "Credits Remaining", 
    value: "47", 
    icon: CreditCard, 
    change: "+50 this month",
    color: "text-primary" 
  },
  { 
    label: "Emails Validated", 
    value: "1,234", 
    icon: Zap, 
    change: "+156 today",
    color: "text-green-500" 
  },
  { 
    label: "Valid Rate", 
    value: "87.3%", 
    icon: TrendingUp, 
    change: "+2.1% vs last week",
    color: "text-blue" 
  },
  { 
    label: "Renewal Date", 
    value: "Jan 15", 
    icon: Clock, 
    change: "Starter Plan",
    color: "text-indigo" 
  },
];

const recentValidations = [
  { email: "john@company.com", status: "valid", time: "2 min ago" },
  { email: "invalid@fake.xyz", status: "invalid", time: "5 min ago" },
  { email: "user@catchall.net", status: "catch-all", time: "12 min ago" },
  { email: "support@business.org", status: "valid", time: "1 hour ago" },
  { email: "test@disposable.io", status: "invalid", time: "2 hours ago" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "valid":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "invalid":
      return <XCircle className="w-4 h-4 text-red-accent" />;
    default:
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const styles = {
    valid: "bg-green-500/10 text-green-600",
    invalid: "bg-red-accent/10 text-red-accent",
    "catch-all": "bg-yellow-500/10 text-yellow-600",
  };
  return styles[status as keyof typeof styles] || styles.valid;
};

export default function DashboardOverview() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your email validation overview.</p>
          </div>
          <Link to="/dashboard/verify-email">
            <Button variant="gradient">
              Validate Email
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-bold font-display mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Validations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-card rounded-xl border border-border"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent Validations</h2>
            <Link to="/dashboard/reports">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentValidations.map((validation, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(validation.status)}
                  <span className="font-mono text-sm">{validation.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(validation.status)}`}>
                    {validation.status}
                  </span>
                  <span className="text-sm text-muted-foreground">{validation.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/dashboard/verify-email" className="block">
            <div className="gradient-border h-full">
              <div className="bg-card h-full p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">Single Validation</h3>
                <p className="text-sm text-muted-foreground">Quickly validate a single email address in real-time.</p>
              </div>
            </div>
          </Link>
          <Link to="/dashboard/verify-list" className="block">
            <div className="gradient-border h-full">
              <div className="bg-card h-full p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <TrendingUp className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">Bulk Upload</h3>
                <p className="text-sm text-muted-foreground">Upload CSV files with thousands of emails for batch processing.</p>
              </div>
            </div>
          </Link>
          <Link to="/dashboard/api-token" className="block">
            <div className="gradient-border h-full">
              <div className="bg-card h-full p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <CreditCard className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">API Integration</h3>
                <p className="text-sm text-muted-foreground">Get your API token and integrate MailVet into your app.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
