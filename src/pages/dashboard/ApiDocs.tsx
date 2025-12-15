import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const endpoints = [
  {
    method: "POST",
    path: "/v1/auth/signup",
    description: "Create a new user account",
    auth: false,
    body: `{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}`,
    response: `{
  "message": "Account created successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}`,
  },
  {
    method: "POST",
    path: "/v1/auth/login",
    description: "Authenticate user and receive tokens",
    auth: false,
    body: `{
  "email": "user@example.com",
  "password": "securePassword123"
}`,
    response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "plan": "pro"
  }
}`,
  },
  {
    method: "POST",
    path: "/v1/auth/refresh",
    description: "Refresh access token using refresh token cookie",
    auth: false,
    body: "No body required. Refresh token sent via HttpOnly cookie.",
    response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}`,
  },
  {
    method: "POST",
    path: "/v1/auth/logout",
    description: "Logout user and invalidate refresh token",
    auth: true,
    body: "No body required.",
    response: `{
  "message": "Logged out successfully"
}`,
  },
  {
    method: "GET",
    path: "/v1/account",
    description: "Get current user profile and usage stats",
    auth: true,
    body: "No body required.",
    response: `{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "credits": 500,
  "plan": "pro",
  "totalValidations": 1250,
  "monthlyValidations": 450
}`,
  },
  {
    method: "PATCH",
    path: "/v1/account",
    description: "Update user profile",
    auth: true,
    body: `{
  "name": "John Smith"
}`,
    response: `{
  "message": "Profile updated",
  "user": {
    "id": "user_123",
    "name": "John Smith"
  }
}`,
  },
  {
    method: "GET",
    path: "/v1/account/usage",
    description: "Get detailed usage statistics",
    auth: true,
    body: "No body required.",
    response: `{
  "credits": 500,
  "plan": "pro",
  "totalValidations": 1250,
  "monthlyValidations": 450,
  "last30Days": {
    "total": 450,
    "valid": 380,
    "invalid": 55,
    "catchAll": 15
  }
}`,
  },
  {
    method: "POST",
    path: "/v1/validation/verify-email",
    description: "Validate a single email address",
    auth: true,
    body: `{
  "email": "test@example.com"
}`,
    response: `{
  "email": "test@example.com",
  "code": "ok",
  "message": "Email is valid and deliverable",
  "catchAll": false,
  "disposable": false,
  "roleBased": false,
  "mxRecords": true,
  "riskLevel": "low"
}`,
  },
  {
    method: "POST",
    path: "/v1/jobs/upload",
    description: "Upload CSV file for bulk validation",
    auth: true,
    body: "multipart/form-data with 'file' field containing CSV",
    response: `{
  "jobId": "job_abc123",
  "emailCount": 1500,
  "status": "pending",
  "message": "Job created successfully"
}`,
  },
  {
    method: "GET",
    path: "/v1/jobs",
    description: "List all validation jobs",
    auth: true,
    body: "No body required.",
    response: `{
  "jobs": [
    {
      "id": "job_abc123",
      "filename": "leads.csv",
      "status": "completed",
      "progress": 100,
      "total": 1500,
      "valid": 1280,
      "invalid": 220,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/v1/jobs/:jobId",
    description: "Get status of a specific job",
    auth: true,
    body: "No body required.",
    response: `{
  "id": "job_abc123",
  "filename": "leads.csv",
  "status": "completed",
  "progress": 100,
  "total": 1500,
  "valid": 1280,
  "invalid": 220,
  "createdAt": "2024-01-15T10:30:00Z"
}`,
  },
  {
    method: "GET",
    path: "/v1/jobs/:jobId/download",
    description: "Download validation results as CSV",
    auth: true,
    body: "No body required.",
    response: "CSV file download",
  },
  {
    method: "GET",
    path: "/v1/billing/status",
    description: "Get current billing status",
    auth: true,
    body: "No body required.",
    response: `{
  "plan": "pro",
  "billingStatus": "active",
  "renewalDate": "2024-02-15T00:00:00Z",
  "canUpgrade": true
}`,
  },
  {
    method: "POST",
    path: "/v1/billing/checkout",
    description: "Initiate checkout for plan upgrade",
    auth: true,
    body: `{
  "plan": "ultimate"
}`,
    response: `{
  "checkoutUrl": "https://checkout.example.com/session_123",
  "plan": "ultimate"
}`,
  },
];

export default function ApiDocs() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "Copied!", description: "Code copied to clipboard." });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/10 text-green-600";
      case "POST":
        return "bg-blue-500/10 text-blue-600";
      case "PATCH":
        return "bg-amber-500/10 text-amber-600";
      case "DELETE":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <TopNavLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">API Documentation</h1>
            <p className="text-muted-foreground">
              Complete reference for the MailVet API endpoints.
            </p>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-2">Base URL</h2>
          <code className="text-sm bg-muted px-3 py-1.5 rounded text-foreground">
            https://api.mailvet.app
          </code>
          <p className="text-sm text-muted-foreground mt-3">
            All API requests must include an <code className="bg-muted px-1.5 py-0.5 rounded">Authorization: Bearer YOUR_API_KEY</code> header for authenticated endpoints.
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Endpoints</h2>
          
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                  {endpoint.auth && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Auth required
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Request Body</p>
                  <div className="relative">
                    <pre className="bg-zinc-950 text-zinc-300 p-4 rounded-lg text-xs overflow-x-auto">
                      {endpoint.body}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleCopy(endpoint.body, index * 2)}
                    >
                      {copiedIndex === index * 2 ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Response</p>
                  <div className="relative">
                    <pre className="bg-zinc-950 text-zinc-300 p-4 rounded-lg text-xs overflow-x-auto">
                      {endpoint.response}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleCopy(endpoint.response, index * 2 + 1)}
                    >
                      {copiedIndex === index * 2 + 1 ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-4">Rate Limits</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Free Plan</span>
              <span className="text-foreground">10 requests/second</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pro Plan</span>
              <span className="text-foreground">50 requests/second</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ultimate Plan</span>
              <span className="text-foreground">100 requests/second</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enterprise</span>
              <span className="text-foreground">Unlimited</span>
            </div>
          </div>
        </div>

        {/* Error Codes */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-semibold text-foreground mb-4">Error Codes</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">400</span>
              <span className="text-foreground">Bad Request - Invalid parameters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">401</span>
              <span className="text-foreground">Unauthorized - Invalid or expired token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">403</span>
              <span className="text-foreground">Forbidden - Insufficient permissions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">404</span>
              <span className="text-foreground">Not Found - Resource doesn't exist</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">409</span>
              <span className="text-foreground">Conflict - User already exists</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">429</span>
              <span className="text-foreground">Too Many Requests - Rate limit exceeded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">500</span>
              <span className="text-foreground">Internal Server Error</span>
            </div>
          </div>
        </div>
      </div>
    </TopNavLayout>
  );
}
