import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import {
  ChartLine,
  CircleCheckBig,
  CreditCard,
  DollarSign,
  Layers,
  Network,
} from "lucide-react";

import { PricingCard } from "./pricing-card";

const pricingFeatures = [
  { icon: Layers, label: "Unlimited accounts and card types" },
  { icon: ChartLine, label: "Advanced analytics and insights" },
  { icon: DollarSign, label: "Automated expense tracking" },
  { icon: Network, label: "Shared team workspace" },
];

export function BillingCard({ isAnnual }: { isAnnual?: boolean }) {
  const billingPeriod = isAnnual
    ? "Billed annually with one month free"
    : "Billed monthly";

  const price = isAnnual ? "$60/year" : "$5/month";

  return (
    <PricingCard title={price}>
      <span className="text-sm font-medium text-muted-foreground">
        {billingPeriod}
      </span>
      <div className="mt-6 flex flex-col gap-3 text-sm">
        {pricingFeatures.map((plan) => (
          <div
            key={plan.label}
            className="group flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-2 transition-colors duration-150 ease-out hover:border-primary/30"
          >
            <plan.icon className="size-4 text-primary" />
            <span className="text-muted-foreground group-hover:text-foreground">
              {plan.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3 pt-2 md:mt-auto">
        <Button
          className="h-10 w-full rounded-full"
          render={
            <Link to="/signup" className="inline-flex items-center gap-2">
              Start with {isAnnual ? "annual" : "monthly"} billing
              <CircleCheckBig className="size-4" />
            </Link>
          }
        />
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CreditCard className="size-4" />
          No credit card required.
        </p>
      </div>
    </PricingCard>
  );
}
