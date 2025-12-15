import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function CatchAll() {
  const isApplied = true; // Mock - would come from user settings

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catch-all</h1>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-8 max-w-xl w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Catch All Verification</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Validate risky emails with 99% accuracy
            </p>

            <div className="text-sm text-muted-foreground space-y-4 mb-6">
              <p>
                In standard email verification, many emails get labeled as Risky, Catch-All, or Unknown, leaving a significant portion of your leads in limbo. Traditional tools often struggle with these, meaning you could miss out on valuable opportunities that are difficult to validate. So, we built a tool to validate risky emails with 99% accuracy.
              </p>

              <div>
                <p className="font-medium text-foreground mb-2">Why you should be interested?</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    These "risky" emails often belong to prospects who are less targeted, making them more likely to engage. This gives you a unique opportunity to connect where others haven't.
                  </li>
                  <li>
                    In niche markets, every contact counts. Catch-All Verification helps you maximize your reach by validating those hard-to-confirm addresses, ensuring no opportunity is missed.
                  </li>
                </ul>
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={isApplied}
              variant={isApplied ? "outline" : "default"}
            >
              {isApplied ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Applied
                </span>
              ) : (
                "Apply Catch-All Verification"
              )}
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MailVet. All rights reserved.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}