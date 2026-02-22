import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

import { DotPattern } from "../../magicui/dot-pattern";
import { Typography } from "../../typography";
import { BillingCard } from "./billing-card";
import { BillingLabel } from "./billing-label";
import { EnterpriseCard } from "./enterprise-card";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="relative flex w-full flex-col items-center justify-center bg-background pb-12 md:pb-20 px-4 sm:px-8 md:px-20 pt-20 md:pt-40"
    >
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />
      <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl text-center">
        Clear and simple <Typography variant="primary">pricing</Typography>
      </h2>
      <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-xl text-center px-4">
        Whether you're starting your financial journey or looking to{" "}
        <Typography variant="primary">preserve your wealth</Typography>, Maybe
        is priced to help you{" "}
        <Typography variant="primary">reach your goals</Typography>.
      </p>
      <div className="flex items-center gap-4 justify-center mt-12">
        <BillingLabel active={!isAnnual} className="justify-end">
          Pay Monthly
        </BillingLabel>
        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
        <BillingLabel active={isAnnual}>
          Pay Annually
          <Badge className={cn(isAnnual ? "" : "bg-gray-500", "transition")}>
            15% OFF
          </Badge>
        </BillingLabel>
      </div>

      <div className="z-10 flex flex-col md:flex-row items-center md:items-start gap-4 justify-center w-full">
        <BillingCard isAnnual={isAnnual} />
        <EnterpriseCard />
      </div>
    </section>
  );
}
