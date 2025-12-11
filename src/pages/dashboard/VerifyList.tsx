import { useState, useCallback } from "react";
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
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  filename: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  total: number;
  valid: number;
  invalid: number;
  createdAt: string;
}

export default function VerifyList() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProUser] = useState(false); // Mock - would come from auth context
  const [jobs] = useState<Job[]>([
    {
      id: "job_1",
      filename: "leads_december.csv",
      status: "completed",
      progress: 100,
      total: 1500,
      valid: 1280,
      invalid: 220,
      createdAt: "2 hours ago",
    },
    {
      id: "job_2",
      filename: "newsletter_subscribers.csv",
      status: "processing",
      progress: 67,
      total: 3200,
      valid: 1840,
      invalid: 305,
      createdAt: "30 minutes ago",
    },
  ]);

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
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  if (!isProUser) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-12"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">Pro Feature</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bulk CSV validation is available on Pro and Ultimate plans. Upgrade now to validate thousands of emails at once.
            </p>
            <Link to="/dashboard/plan">
              <Button variant="cta" size="lg">
                Upgrade to Pro
              </Button>
            </Link>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Verify List</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to validate multiple email addresses in batch.
          </p>
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
              <p className="font-medium mb-1">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground mb-6">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="gradient">
                  <Upload className="w-4 h-4" />
                  Start Validation
                </Button>
                <Button variant="outline" onClick={() => setUploadedFile(null)}>
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">Drag and drop your CSV file here</p>
              <p className="text-sm text-muted-foreground mb-6">or click to browse</p>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="gradient-outline" asChild>
                  <span className="cursor-pointer">Browse Files</span>
                </Button>
              </label>
            </div>
          )}
        </motion.div>

        {/* Active Jobs */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Validation Jobs</h2>
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
                      <p className="font-medium">{job.filename}</p>
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
                    ) : (
                      <span className="flex items-center gap-2 text-red-accent text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Failed
                      </span>
                    )}
                    {job.status === "completed" && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
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
                      <span className="font-medium">{job.total.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Valid: </span>
                      <span className="font-medium text-green-500">{job.valid.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Invalid: </span>
                      <span className="font-medium text-red-accent">{job.invalid.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
