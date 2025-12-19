import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { authenticatedFetch } from "@/lib/auth";

type Job = {
  _id: string;
  originalFilename: string;
  status: "pending" | "processing" | "completed" | "failed";
  totalEmails?: number;
  processedEmails?: number;
  progress?: number;
  createdAt?: string;
};

export default function Reports() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setIsLoading(true);
      try {
        const response = await authenticatedFetch(`${apiBaseUrl}/v1/jobs?limit=50`, {
          method: "GET",
        });

        const payload = await response.json().catch(() => ({} as any));
        if (!response.ok) return;
        if (!mounted) return;

        setJobs(Array.isArray(payload?.jobs) ? payload.jobs : []);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [apiBaseUrl]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (jobs.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">No Emails or List Clean yet.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">📊 Reports</h1>
          <p className="text-muted-foreground">All your uploaded lists appear here.</p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold text-muted-foreground border-b border-border">
            <div className="col-span-6">List</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Progress</div>
          </div>

          {jobs.map((job) => (
            <div key={job._id} className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-border last:border-b-0">
              <div className="col-span-6 min-w-0">
                <p className="font-semibold text-foreground truncate">📄 {job.originalFilename}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-foreground">
                  {job.status === "pending"
                    ? "Queued ⏳"
                    : job.status === "processing"
                      ? "Processing 🔄"
                      : job.status === "completed"
                        ? "Completed ✅"
                        : "Failed ❌"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-foreground">
                  {typeof job.totalEmails === "number" ? job.totalEmails.toLocaleString() : "—"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-foreground">
                  {typeof job.progress === "number" ? `${job.progress}%` : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
