import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, CheckCircle, XCircle, Mail, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { authenticatedFetch } from "@/lib/auth";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";

interface EmailLog {
  timestamp: string;
  status: "success" | "failed";
  type: string;
  to: string;
  from: string;
  subject: string;
  resendId?: string;
  error?: string;
}

export default function AdminEmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/admin/email-logs?limit=100`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Admin access required");
        }
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch email logs");
      toast({
        title: "Error",
        description: err.message || "Failed to fetch email logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = async () => {
    setIsClearing(true);
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/admin/email-logs`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to clear logs");
      }
      setLogs([]);
      toast({ title: "Logs cleared", description: "Email logs have been cleared." });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to clear logs",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const successCount = logs.filter((l) => l.status === "success").length;
  const failedCount = logs.filter((l) => l.status === "failed").length;

  return (
    <TopNavLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Email Diagnostics</h1>
                <p className="text-sm text-muted-foreground">Admin-only email send logs</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearLogs}
                disabled={isClearing || logs.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{logs.length}</p>
                    <p className="text-xs text-muted-foreground">Total Logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{successCount}</p>
                    <p className="text-xs text-muted-foreground">Successful</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <XCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Logs</CardTitle>
              <CardDescription>
                Last {logs.length} email send attempts (max 100 stored in memory)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No email logs yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">Status</th>
                        <th className="text-left py-3 px-2 font-medium">Type</th>
                        <th className="text-left py-3 px-2 font-medium">To</th>
                        <th className="text-left py-3 px-2 font-medium">Subject</th>
                        <th className="text-left py-3 px-2 font-medium">Resend ID</th>
                        <th className="text-left py-3 px-2 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2">
                            <Badge
                              variant={log.status === "success" ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {log.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 font-mono text-xs">{log.type}</td>
                          <td className="py-3 px-2 font-mono text-xs">{log.to}</td>
                          <td className="py-3 px-2 truncate max-w-[200px]" title={log.subject}>
                            {log.subject}
                          </td>
                          <td className="py-3 px-2 font-mono text-xs text-muted-foreground">
                            {log.resendId || log.error || "—"}
                          </td>
                          <td className="py-3 px-2 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TopNavLayout>
  );
}
