import type { ComponentType } from "react";

import { cn } from "~/lib/utils";

type InsightCardProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  iconTone: string;
  label: string;
  value: string;
  valueTone?: string;
  hint: string;
};

export function InsightCard({
  icon: Icon,
  iconTone,
  label,
  value,
  valueTone,
  hint,
}: InsightCardProps) {
  return (
    <div className="group/insight border-border/60 bg-card ring-foreground/5 hover:ring-foreground/10 relative overflow-hidden rounded-2xl border p-3 ring-1 transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-muted-foreground text-[0.7rem] tracking-[0.12em] uppercase">
          {label}
        </dt>
        <Icon className={cn("size-4", iconTone)} aria-hidden={true} />
      </div>
      <dd
        className={cn(
          "mt-2 text-base font-semibold tracking-tight tabular-nums sm:text-lg",
          valueTone ?? "text-foreground",
        )}
      >
        {value}
      </dd>
      <p className="text-muted-foreground mt-0.5 text-[0.7rem]">{hint}</p>
    </div>
  );
}
