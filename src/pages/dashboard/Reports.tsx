import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Download,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Validated", value: "12,458", change: "+18%", up: true },
  { label: "Valid Emails", value: "10,841", change: "+15%", up: true },
  { label: "Invalid Emails", value: "1,432", change: "-8%", up: false },
  { label: "Catch-All", value: "185", change: "+2%", up: true },
];

const recentJobs = [
  {
    id: "job_001",
    date: "Dec 10, 2024",
    type: "Bulk",
    total: 3500,
    valid: 3120,
    invalid: 280,
    catchAll: 100,
  },
  {
    id: "job_002",
    date: "Dec 8, 2024",
    type: "Bulk",
    total: 1200,
    valid: 1050,
    invalid: 120,
    catchAll: 30,
  },
  {
    id: "job_003",
    date: "Dec 5, 2024",
    type: "Single",
    total: 45,
    valid: 40,
    invalid: 5,
    catchAll: 0,
  },
];

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">
              View your validation history and analytics.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Calendar className="w-4 h-4" />
              Last 30 Days
            </Button>
            <Button variant="gradient">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.up ? "text-green-500" : "text-red-accent"
                  }`}
                >
                  {stat.up ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="font-display text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Validation Trends</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Valid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-accent" />
                <span className="text-sm text-muted-foreground">Invalid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-muted-foreground">Catch-All</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>
        </motion.div>

        {/* Job History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold">Job History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Job ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valid</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invalid</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Catch-All</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-mono text-sm">{job.id}</td>
                    <td className="p-4 text-sm">{job.date}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {job.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium">{job.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {job.valid.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-accent" />
                        {job.invalid.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        {job.catchAll}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
