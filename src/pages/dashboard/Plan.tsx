import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Folder, Upload, Zap, ChevronRight, Lock } from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";

const plans = [
  {
    name: "Free Plan",
    badge: "Basic",
    price: "$0",
    priceAnnual: "$0",
    tagline: "Always Free",
    planKey: "free",
    features: [
      {
        icon: Mail,
        title: "Unlimited Verification Credits",
        description: "Validate unlimited emails, no credit limits.",
      },
      {
        icon: Folder,
        title: "Basic Recent Lists Storage",
        description: "Store up to 4 recent lists.",
      },
      {
        icon: Upload,
        title: "Upload 1,000 Emails per List",
        description: "Upload up to 1,000 emails per list.",
      },
      {
        icon: Zap,
        title: "Standard Verification Queue",
        description: "Standard processing speed for verifications.",
      },
    ],
  },
  {
    name: "Pro Plan",
    badge: "Upgrade",
    price: "$29.99",
    priceAnnual: "$24.99",
    tagline: "Save 16.7% with annual billing",
    planKey: "pro",
    popular: true,
    features: [
      {
        icon: Mail,
        title: "Unlimited Verification Credits",
        description: "Validate unlimited emails, no credit limits.",
      },
      {
        icon: Folder,
        title: "Unlimited Recent Lists Storage",
        description: "Store unlimited lists in your recent lists.",
      },
      {
        icon: Upload,
        title: "Upload 10,000 Emails per List",
        description: "Increase upload up to 10,000 emails per list.",
      },
      {
        icon: Zap,
        title: "Faster Verification Queue",
        description: "Priority processing speed for verifications.",
      },
    ],
  },
];

export default function PlanManagement() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useUser();
  const currentPlan = user?.plan || "free";

  return (
    <TopNavLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Upgrade</h1>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {plans.map((plan, index) => {
            const isCurrent = currentPlan === plan.planKey;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border bg-card text-foreground border-border">
                    {isCurrent ? "Current" : plan.badge}
                  </span>
                </div>

                {/* Billing Toggle for Pro */}
                {plan.popular && (
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={cn("text-sm", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
                      Monthly
                    </span>
                    <Switch
                      checked={isAnnual}
                      onCheckedChange={setIsAnnual}
                    />
                    <span className={cn("text-sm", isAnnual ? "text-foreground" : "text-muted-foreground")}>
                      Annual
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="text-center mb-2">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.popular && isAnnual ? plan.priceAnnual : plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Tagline */}
                <p className={cn(
                  "text-center text-sm mb-6",
                  plan.popular && isAnnual ? "text-amber-600" : "text-muted-foreground"
                )}>
                  {plan.popular && isAnnual 
                    ? "Save 16.7% with annual billing" 
                    : plan.tagline}
                </p>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full mb-6",
                    isCurrent 
                      ? "bg-muted text-muted-foreground hover:bg-muted cursor-default" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    plan.planKey === "free" ? "Free Plan" : "Current Plan"
                  ) : (
                    <span className="flex items-center gap-2">
                      Upgrade to Pro
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="border-t border-border mb-6" />

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <feature.icon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Badge for Pro */}
                {plan.popular && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Guaranteed safe and secure checkout. Powered by Stripe.</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Questions? Contact our team at{" "}
            <a href="mailto:support@mailvet.app" className="text-primary hover:underline">
              support@mailvet.app
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MailVet. All rights reserved.
          </p>
        </div>
      </div>
    </TopNavLayout>
  );
}
