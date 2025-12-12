import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$9.99",
    current: true,
    features: [
      "100 free credits included",
      "1 email/second rate limit",
      "Single email validation",
      "API access",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    current: false,
    popular: true,
    features: [
      "Everything in Starter",
      "3 emails/second rate limit",
      "CSV bulk upload",
      "Priority support",
      "Detailed analytics",
      "Webhook notifications",
    ],
  },
  {
    name: "Ultimate",
    price: "$29.99",
    current: false,
    features: [
      "Everything in Pro",
      "10 emails/second rate limit",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "White-label options",
    ],
  },
];

export default function PlanManagement() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Plan & Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view billing details.
          </p>
        </div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
              <p className="font-display text-2xl font-bold">
                Starter <span className="text-muted-foreground font-normal text-lg">$9.99/mo</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Next billing date</p>
              <p className="font-medium">January 15, 2025</p>
            </div>
          </div>
        </motion.div>

        {/* Plan Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-xl border p-6",
                plan.popular
                  ? "gradient-border bg-card"
                  : plan.current
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              {plan.current && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Current Plan
                </span>
              )}

              <div className="mb-6 pt-2">
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.current ? "outline" : plan.popular ? "cta" : "gradient-outline"}
                className="w-full"
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold">Billing History</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { date: "Dec 15, 2024", amount: "$9.99", status: "Paid" },
              { date: "Nov 15, 2024", amount: "$9.99", status: "Paid" },
              { date: "Oct 15, 2024", amount: "$9.99", status: "Paid" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">Starter Plan - Monthly</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-green-500 text-sm font-medium">{invoice.status}</span>
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
