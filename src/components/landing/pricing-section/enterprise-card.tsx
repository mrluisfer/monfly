import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import {
  ArrowUpRight,
  ChartNoAxesGantt,
  Cog,
  Globe,
  ReplaceAll,
} from "lucide-react";

import { PricingCard } from "./pricing-card";

const enterpriseFeatures = [
  {
    label: "Everything in Pro plus advanced governance",
    icon: ReplaceAll,
  },
  { label: "Role-based access and security controls", icon: Cog },
  {
    label: "Dedicated onboarding and migration support",
    icon: ChartNoAxesGantt,
  },
  { label: "Multi-region deployment and API contracts", icon: Globe },
];

export function EnterpriseCard() {
  return (
    <PricingCard title={<span>$ENT</span>}>
      <span className="text-sm font-medium text-muted-foreground">
        Custom pricing for high-scale finance teams
      </span>
      <div className="mt-6 flex flex-col gap-3 text-sm">
        {enterpriseFeatures.map((feature) => (
          <div
            key={feature.label}
            className="group flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-2 transition-colors duration-150 ease-out hover:border-primary/30"
          >
            <feature.icon className="size-4 text-primary" />
            <span className="text-muted-foreground group-hover:text-foreground">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="lg"
        className="mt-6 h-10 w-full rounded-full border-border/70 md:mt-auto"
        render={
          <Link to="/signup" className="inline-flex items-center gap-2">
            Talk to sales
            <ArrowUpRight className="size-4" />
          </Link>
        }
      />
    </PricingCard>
  );
}
