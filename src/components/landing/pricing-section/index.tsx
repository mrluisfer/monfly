import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

import { DotPattern } from "../../magicui/dot-pattern";
import { BillingCard } from "./billing-card";
import { BillingLabel } from "./billing-label";
import { EnterpriseCard } from "./enterprise-card";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="landing-glass-panel relative overflow-hidden rounded-[2rem] border border-border/70 px-4 py-10 sm:px-8 md:px-10 md:py-12">
          <DotPattern
            className="opacity-35 [mask-image:radial-gradient(650px_circle_at_top,white,transparent)]"
            glow
          />
          <div className="relative z-10 space-y-8">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <h2
                id="pricing-title"
                className="text-balance text-3xl font-semibold sm:text-4xl md:text-5xl"
              >
                Pricing designed for individuals and fast-moving teams
              </h2>
              <p className="text-pretty text-muted-foreground md:text-lg">
                Start lean and upgrade when your workflow grows. No hidden fees,
                no onboarding bottlenecks.
              </p>
            </div>

            <div
              aria-label="Billing cycle switch"
              className="mx-auto flex w-fit items-center gap-3 rounded-full border border-border/70 bg-background/70 px-3 py-2"
            >
              <BillingLabel active={!isAnnual} className="justify-end">
                Monthly
              </BillingLabel>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                aria-label="Toggle annual billing"
              />
              <BillingLabel active={isAnnual}>
                Annual
                <Badge
                  className={cn(
                    isAnnual ? "" : "bg-muted",
                    "transition-colors duration-150 ease-out"
                  )}
                >
                  Save 15%
                </Badge>
              </BillingLabel>
            </div>

            <div className="grid items-stretch gap-4 md:grid-cols-2">
              <BillingCard isAnnual={isAnnual} />
              <EnterpriseCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
