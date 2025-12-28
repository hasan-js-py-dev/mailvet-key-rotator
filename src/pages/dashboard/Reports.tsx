import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { authenticatedFetch } from "@/lib/auth";
import { getValidationApiBaseUrl } from "@/lib/validationApi";

type ActivityItem = {
  _id: string;
  email: string;
  domain?: string;
  provider?: string;
  code?: string;
  message?: string;
  riskLevel?: "low" | "medium" | "high";
  creditsConsumed?: number;
  createdAt?: string;
};

export default function Reports() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = getValidationApiBaseUrl();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!apiBaseUrl) {
        if (mounted) setActivity([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await authenticatedFetch(`${apiBaseUrl}/v1/validation/activity?limit=50`, {
          method: "GET",
        });

        const payload = await response.json().catch(() => ({} as any));
        if (!response.ok) return;
        if (!mounted) return;

        setActivity(Array.isArray(payload?.activity) ? payload.activity : []);
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

  if (activity.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">No recent verification activity yet.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Your most recent single-email verifications.</p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold text-muted-foreground border-b border-border">
            <div className="col-span-5">Email</div>
            <div className="col-span-2">Code</div>
            <div className="col-span-3">Message</div>
            <div className="col-span-2">When</div>
          </div>

          {activity.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-border last:border-b-0"
            >
              <div className="col-span-5 min-w-0">
                <p className="font-semibold text-foreground truncate">{item.email}</p>
                <p className="text-xs text-muted-foreground truncate">{item.domain || "—"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-foreground">{item.code || "—"}</span>
              </div>
              <div className="col-span-3 min-w-0">
                <span className="text-sm text-foreground truncate block">{item.message || "—"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-foreground">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
