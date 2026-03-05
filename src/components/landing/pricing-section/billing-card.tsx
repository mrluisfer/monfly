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
  { icon: Layers, label: "Unlimited accounts and card structures" },
  { icon: ChartLine, label: "Scenario-based analytics and insights" },
  { icon: DollarSign, label: "Automated tracking with smart categories" },
  { icon: Network, label: "Shared workspace for collaborative planning" },
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
      <div className="mt-5 flex flex-col gap-2.5 text-sm">
        {pricingFeatures.map((plan) => (
          <div
            key={plan.label}
            className="group flex items-center gap-2 rounded-xl border border-border/55 bg-background/72 px-3 py-2.5 transition-colors duration-150 ease-out hover:border-primary/35"
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
          size="lg"
          className="h-10 w-full rounded-full"
          render={
            <Link to="/signup" className="inline-flex items-center gap-2">
              Start {isAnnual ? "annual" : "monthly"} plan
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
