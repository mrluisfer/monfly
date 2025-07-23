import { ChartNoAxesGantt, Cog, Globe, ReplaceAll } from "lucide-react";

import { PricingCard } from "./pricing-card";

const enterpriseFeatures = [
  {
    label: "All basic plan features and...",
    icon: ReplaceAll,
  },
  { label: "Advanced security controls", icon: Cog },
  { label: "Migration support", icon: ChartNoAxesGantt },
  { label: "And much more...", icon: Globe },
];

export function EnterpriseCard() {
  return (
    <PricingCard title={<span>$ENT</span>}>
      <span className="text-sm font-semibold text-muted-foreground">
        Custom Enterprise Price
      </span>
      <div className="mt-6 flex flex-col gap-6 text-sm">
        {enterpriseFeatures.map((feature) => (
          <div key={feature.label} className="flex items-center gap-2 group">
            <feature.icon className="size-5 text-primary" />
            <span className="text-muted-foreground group-hover:text-gray-900 transition">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </PricingCard>
  );
}
