import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  Download, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Loader2,
  List,
  Trash2,
} from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";

interface Job {
  id: string;
  filename: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  total: number;
  valid: number;
  invalid: number;
  createdAt: string;
}

export default function Lists() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const { user } = useUser();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
  const isProUser = user?.plan !== "free";

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/v1/jobs`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      setUploadedFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleStartValidation = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch(`${apiBaseUrl}/v1/jobs/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      toast({
        title: "Upload successful",
        description: `Job ${data.jobId} created. Processing ${data.emailCount} emails.`,
      });

      setUploadedFile(null);
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (jobId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/v1/jobs/${jobId}/download`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mailvet-results-${jobId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download results",
        variant: "destructive",
      });
    }
  };

  if (!isProUser) {
    return (
      <TopNavLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-12"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Pro Feature</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bulk CSV validation is available on Pro and Ultimate plans. Upgrade now to validate thousands of emails at once.
            </p>
            <Link to="/dashboard/plan">
              <Button size="lg">
                Upgrade to Pro
              </Button>
            </Link>
          </motion.div>
        </div>
      </TopNavLayout>
    );
  }

  return (
    <TopNavLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <List className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Email Lists</h1>
            <p className="text-muted-foreground">
              Upload a CSV file to validate multiple email addresses in batch.
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-card rounded-xl border-2 border-dashed transition-colors p-12 ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-green-500" />
              </div>
              <p className="font-medium mb-1 text-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground mb-6">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleStartValidation} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Start Validation
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setUploadedFile(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1 text-foreground">Drag and drop your CSV file here</p>
              <p className="text-sm text-muted-foreground mb-6">or click to browse</p>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span className="cursor-pointer">Browse Files</span>
                </Button>
              </label>
            </div>
          )}
        </motion.div>

        {/* Jobs List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Lists</h2>
          
          {isLoadingJobs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No lists uploaded yet. Upload a CSV to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{job.filename}</p>
                        <p className="text-sm text-muted-foreground">{job.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {job.status === "completed" ? (
                        <span className="flex items-center gap-2 text-green-500 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      ) : job.status === "processing" ? (
                        <span className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                          <Clock className="w-4 h-4 animate-spin" />
                          Processing
                        </span>
                      ) : job.status === "failed" ? (
                        <span className="flex items-center gap-2 text-red-500 text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      {job.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => handleDownload(job.id)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>

                  {job.status === "processing" && (
                    <div className="space-y-2">
                      <Progress value={job.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {Math.round((job.total * job.progress) / 100).toLocaleString()} of{" "}
                        {job.total.toLocaleString()} emails processed
                      </p>
                    </div>
                  )}

                  {job.status === "completed" && (
                    <div className="flex items-center gap-8 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-medium text-foreground">{job.total.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Valid: </span>
                        <span className="font-medium text-green-500">{job.valid.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Invalid: </span>
                        <span className="font-medium text-red-500">{job.invalid.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TopNavLayout>
  );
}
