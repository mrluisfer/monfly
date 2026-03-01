import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import {
  ChartLine,
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
  { icon: Network, label: "All features included" },
];

export function BillingCard({ isAnnual }: { isAnnual?: boolean }) {
  const billingPeriod = isAnnual
    ? "Billed annually, 1month free"
    : "Billed monthly";

  const price = isAnnual ? "$60/year" : "$5/month";

  return (
    <PricingCard title={price}>
      <span className="text-sm font-semibold text-muted-foreground">
        {billingPeriod}
      </span>
      <div className="mt-6 flex flex-col gap-6 text-sm">
        {pricingFeatures.map((plan) => (
          <div key={plan.label} className="flex items-center gap-2 group">
            <plan.icon className="size-5 text-primary" />
            <span className="text-muted-foreground group-hover:text-gray-900 transition">
              {plan.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-4">
        <Button
          render={
            <Link to="/signup">
              Start your journey with our {isAnnual ? "annual" : "monthly"}{" "}
              plan
            </Link>
          }
        />
        <p className="flex items-center justify-center gap-2 text-xs  text-gray-500 hover:text-gray-700 transition">
          <CreditCard />
          No credit card required.
        </p>
      </div>
    </PricingCard>
  );
}
