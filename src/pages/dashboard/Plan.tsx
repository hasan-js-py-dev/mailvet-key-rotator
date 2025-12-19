import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Folder, Upload, Zap, ChevronRight, Lock, Check, Crown } from "lucide-react";
import { TopNavLayout } from "@/components/dashboard/TopNavLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";

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
        title: "100 Verification Credits",
        description: "Start with 100 free email verifications.",
      },
      {
        icon: Folder,
        title: "Basic Recent Lists Storage",
        description: "Store up to 4 recent lists.",
      },
      {
        icon: Upload,
        title: "Upload 100 Emails per List",
        description: "Upload up to 100 emails per list.",
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
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { user, refetch } = useUser();
  const currentPlan = user?.plan || "free";
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  const handleUpgrade = async (planKey: string) => {
    if (planKey === currentPlan) return;
    
    // For free plan (downgrade), just show message
    if (planKey === 'free') {
      toast({
        title: "Contact Support",
        description: "Please contact support to downgrade your plan.",
      });
      return;
    }
    
    setIsUpgrading(true);
    try {
      const token = localStorage.getItem("mailvet_session");
      const response = await fetch(`${apiBaseUrl}/v1/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ 
          plan: planKey === 'pro' ? 'ultimate' : planKey,
          billingCycle: isAnnual ? 'annual' : 'monthly'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to initiate checkout");
      }

      const data = await response.json();
      
      // Redirect to checkout URL
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Checkout Initiated",
          description: "Redirecting to payment...",
        });
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: error instanceof Error ? error.message : "Failed to upgrade plan",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <TopNavLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            Plans & Pricing
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Select the plan that best fits your email verification needs.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const isCurrent = currentPlan === plan.planKey || 
              (plan.planKey === 'pro' && (currentPlan === 'ultimate' || currentPlan === 'enterprise'));
            const isPro = plan.popular;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-card border rounded-lg p-6 relative",
                  isPro ? "border-primary shadow-lg" : "border-border"
                )}
              >
                {/* Popular Badge */}
                {isPro && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    isCurrent 
                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                      : "bg-card text-foreground border-border"
                  )}>
                    {isCurrent ? "Current Plan" : plan.badge}
                  </span>
                </div>

                {/* Billing Toggle for Pro */}
                {isPro && (
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={cn("text-sm", !isAnnual ? "text-foreground font-medium" : "text-muted-foreground")}>
                      Monthly
                    </span>
                    <Switch
                      checked={isAnnual}
                      onCheckedChange={setIsAnnual}
                    />
                    <span className={cn("text-sm", isAnnual ? "text-foreground font-medium" : "text-muted-foreground")}>
                      Annual
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="text-center mb-2">
                  <span className="text-4xl font-bold text-foreground">
                    {isPro && isAnnual ? plan.priceAnnual : plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Tagline */}
                <p className={cn(
                  "text-center text-sm mb-6",
                  isPro && isAnnual ? "text-green-600 font-medium" : "text-muted-foreground"
                )}>
                  {isPro && isAnnual 
                    ? "Save 16.7% with annual billing" 
                    : plan.tagline}
                </p>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full mb-6",
                    isCurrent 
                      ? "bg-muted text-muted-foreground hover:bg-muted cursor-default" 
                      : isPro
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                  disabled={isCurrent || isUpgrading}
                  onClick={() => handleUpgrade(plan.planKey)}
                >
                  {isUpgrading ? (
                    <span className="flex items-center gap-2">
                      Processing...
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Current Plan
                    </span>
                  ) : isPro ? (
                    <span className="flex items-center gap-2">
                      Upgrade to Pro
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  ) : (
                    "Free Plan"
                  )}
                </Button>

                {/* Divider */}
                <div className="border-t border-border mb-6" />

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className={cn(
                        "p-1.5 rounded-md",
                        isPro ? "bg-primary/10" : "bg-muted"
                      )}>
                        <feature.icon className={cn(
                          "w-4 h-4",
                          isPro ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Badge for Pro */}
                {isPro && (
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