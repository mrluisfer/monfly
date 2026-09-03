import { CalendarRangeIcon } from "lucide-react";

import { Card } from "~/components/ui/card";
import { useCurrency } from "~/hooks/useCurrency";

import type { IncomeExpensePoint } from "./types";

interface RangeStripProps {
  best: IncomeExpensePoint;
  worst: IncomeExpensePoint;
}

export function RangeStrip({ best, worst }: RangeStripProps) {
  const { formatPlain } = useCurrency();
  if (best.label === worst.label) {
    return null;
  }
  return (
    <Card
      size="sm"
      className="px-(--card-spacing) text-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="flex items-center gap-2 text-muted-foreground">
        <CalendarRangeIcon
          className="size-3.5 text-muted-foreground"
          aria-hidden={true}
        />
        Range across recent periods
      </span>
      <span className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-chart-1" aria-hidden={true} />
          <span className="text-muted-foreground">Best</span>
          <span className="font-medium text-foreground tabular-nums">
            {best.label}
          </span>
          <span className="text-chart-1 tabular-nums">
            {formatPlain(best.net)}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="size-2 rounded-full bg-destructive"
            aria-hidden={true}
          />
          <span className="text-muted-foreground">Lowest</span>
          <span className="font-medium text-foreground tabular-nums">
            {worst.label}
          </span>
          <span className="text-destructive tabular-nums">
            {formatPlain(worst.net)}
          </span>
        </span>
      </span>
    </Card>
  );
}
