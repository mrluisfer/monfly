import { cn } from "~/lib/utils";

import { SavingsRing } from "./SavingsRing";
import type { RingTone } from "./types";

type SavingsRateCardProps = {
  rate: number | null;
  hidden: boolean;
};

const HEALTHY_THRESHOLD = 0.2;

function resolveTone(rate: number | null, safeRate: number): string {
  if (rate === null) return "text-muted-foreground";
  if (safeRate >= HEALTHY_THRESHOLD)
    return "text-emerald-600 dark:text-emerald-300";
  if (safeRate >= 0) return "text-amber-600 dark:text-amber-300";
  return "text-destructive";
}

function resolveRingTone(safeRate: number): RingTone {
  if (safeRate >= HEALTHY_THRESHOLD) return "emerald";
  if (safeRate >= 0) return "amber";
  return "destructive";
}

function resolveHint(rate: number | null, safeRate: number): string {
  if (rate === null) return "needs income";
  if (safeRate >= HEALTHY_THRESHOLD) return "healthy savings";
  if (safeRate >= 0) return "modest savings";
  return "spending exceeds income";
}

export function SavingsRateCard({ rate, hidden }: SavingsRateCardProps) {
  const safeRate = rate ?? 0;
  const clamped = Math.max(-1, Math.min(1, safeRate));
  const display =
    rate === null ? "—" : hidden ? "••" : `${(clamped * 100).toFixed(0)}%`;

  return (
    <div className="group/insight border-border/60 bg-card ring-foreground/5 hover:ring-foreground/10 relative overflow-hidden rounded-2xl border p-3 ring-1 transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <dt className="text-muted-foreground text-[0.7rem] tracking-[0.12em] uppercase">
            Savings rate
          </dt>
          <dd
            className={cn(
              "mt-2 text-base font-semibold tracking-tight tabular-nums sm:text-lg",
              resolveTone(rate, safeRate),
            )}
          >
            {display}
          </dd>
          <p className="text-muted-foreground mt-0.5 truncate text-[0.7rem]">
            {resolveHint(rate, safeRate)}
          </p>
        </div>
        <SavingsRing
          value={Math.max(0, clamped)}
          tone={resolveRingTone(safeRate)}
          dimmed={hidden || rate === null}
        />
      </div>
    </div>
  );
}
