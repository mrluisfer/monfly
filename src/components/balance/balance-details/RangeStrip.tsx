import { CalendarRangeIcon } from "lucide-react";

import { formatCurrency } from "~/utils/format-currency";

import { BALANCE_CURRENCY } from "./constants";
import type { IncomeExpensePoint } from "./types";

type RangeStripProps = {
  best: IncomeExpensePoint;
  worst: IncomeExpensePoint;
};

export function RangeStrip({ best, worst }: RangeStripProps) {
  if (best.label === worst.label) return null;
  return (
    <div className="border-border/60 bg-card/60 flex flex-col gap-2 rounded-2xl border p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground flex items-center gap-2">
        <CalendarRangeIcon
          className="text-muted-foreground size-3.5"
          aria-hidden={true}
        />
        Range across recent periods
      </span>
      <span className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-primary size-2 rounded-full" aria-hidden={true} />
          <span className="text-muted-foreground">Best</span>
          <span className="text-foreground font-medium tabular-nums">
            {best.label}
          </span>
          <span className="text-primary tabular-nums">
            {formatCurrency(best.net, BALANCE_CURRENCY)}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="bg-destructive size-2 rounded-full"
            aria-hidden={true}
          />
          <span className="text-muted-foreground">Lowest</span>
          <span className="text-foreground font-medium tabular-nums">
            {worst.label}
          </span>
          <span className="text-destructive tabular-nums">
            {formatCurrency(worst.net, BALANCE_CURRENCY)}
          </span>
        </span>
      </span>
    </div>
  );
}
