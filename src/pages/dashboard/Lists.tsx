import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload } from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
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

export default function Lists() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode] = useState<"standard">("standard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  const isAllowedFile = (file: File) => {
    const name = file.name.toLowerCase();
    return name.endsWith(".csv") || name.endsWith(".xls") || name.endsWith(".xlsx");
  };

  const setFileOrToast = (file: File | undefined | null) => {
    if (!file) return;
    if (isAllowedFile(file)) {
      setUploadedFile(file);
      return;
    }

    toast({
      title: "Invalid file",
      description: "Upload a .csv, .xls, or .xlsx file.",
      variant: "destructive",
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setFileOrToast(e.dataTransfer.files?.[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileOrToast(e.target.files?.[0]);
  };

  const handleStartValidation = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("mode", mode);

      const response = await authenticatedFetch(`${apiBaseUrl}/v1/jobs/upload`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({} as any));
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Upload failed");
      }

      toast({
        title: "Upload successful",
        description: `Job ${payload.jobId} created. ${payload.emailCount} emails queued.`,
      });
      setUploadedFile(null);
      void fetchJobs();
    } catch (error) {
      toast({
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const response = await authenticatedFetch(`${apiBaseUrl}/v1/jobs?limit=50`, {
        method: "GET",
      });

      const payload = await response.json().catch(() => ({} as any));
      if (!response.ok) {
        return;
      }

      setJobs(Array.isArray(payload?.jobs) ? payload.jobs : []);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const processingJobs = useMemo(() => {
    return jobs.filter((j) => j.status === "pending" || j.status === "processing");
  }, [jobs]);

  const statusPill = (status: Job["status"]) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";
    switch (status) {
      case "processing":
        return `${base} bg-muted text-foreground border-border`;
      case "pending":
        return `${base} bg-muted text-foreground border-border`;
      case "completed":
        return `${base} bg-muted text-foreground border-border`;
      case "failed":
        return `${base} bg-muted text-foreground border-border`;
      default:
        return `${base} bg-muted text-foreground border-border`;
    }
  };

  return (
    <TopNavLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">📥 Bulk Upload</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Upload a spreadsheet and we’ll queue your list clean instantly. ✨
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-8"
        >
          <div className="flex items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">📄 Upload a file</h2>
              <p className="text-sm text-muted-foreground">Supported: CSV, XLS, XLSX</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">10,000</p>
              <p className="text-xs text-muted-foreground">max rows / list</p>
            </div>
          </div>

          {/* Keeping internal mode as "standard"; Catch-all option removed per request */}
          <div className="sr-only">
            <Tabs value={mode}>
              <TabsList>
                <TabsTrigger value="standard">Standard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div
            className={`mt-6 rounded-xl border-2 border-dashed p-10 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <Upload className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Drag & drop your file here 👇</p>
                <p className="text-sm text-muted-foreground">CSV / XLS / XLSX • up to 10,000 rows</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label>
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">Choose file 📎</span>
                  </Button>
                </label>

                <Button variant="gradient" size="lg" disabled={!uploadedFile || isUploading} onClick={handleStartValidation}>
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Click Upload 🚀
                </Button>
              </div>

              {uploadedFile ? (
                <div className="mt-4 text-sm text-muted-foreground">
                  Selected: <span className="text-foreground font-medium">{uploadedFile.name}</span> ✅
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => setUploadedFile(null)}>
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">How to Use ⚡</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="font-semibold text-foreground">1️⃣ Prepare your file</p>
              <p className="text-sm text-muted-foreground mt-2">One email per row (headers OK).</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="font-semibold text-foreground">2️⃣ Upload</p>
              <p className="text-sm text-muted-foreground mt-2">Up to 10,000 rows per list.</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="font-semibold text-foreground">3️⃣ Get results</p>
              <p className="text-sm text-muted-foreground mt-2">We process and you download when ready.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">⏳ Processing Lists</h2>

          {isLoadingJobs ? (
            <div className="bg-card rounded-xl border border-border p-6 text-muted-foreground">
              Loading…
            </div>
          ) : processingJobs.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-6 text-muted-foreground">
              No processing lists yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {processingJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">📄 {job.originalFilename}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {typeof job.totalEmails === "number" ? `${job.totalEmails.toLocaleString()} emails` : ""}
                        {typeof job.totalEmails === "number" && typeof job.processedEmails === "number"
                          ? ` • ${job.processedEmails.toLocaleString()} processed`
                          : ""}
                      </p>
                    </div>

                    <span className={statusPill(job.status)}>
                      {job.status === "processing" ? "Processing 🔄" : "Queued ⏳"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TopNavLayout>
  );
}
