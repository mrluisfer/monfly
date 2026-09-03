import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useCurrency } from "~/hooks/useCurrency";
import { cn } from "~/lib/utils";

import type { IncomeExpensePoint } from "./types";

interface SparklineProps {
  max: number;
  points: IncomeExpensePoint[];
}

/** Minimum bar height (in %) so near-zero periods stay visible. */
const MIN_BAR_HEIGHT_PCT = 6;

export function Sparkline({ points, max }: SparklineProps) {
  const { formatPlain } = useCurrency();
  if (max <= 0) {
    return null;
  }
  return (
    <div
      className="flex h-8 items-end gap-1"
      role="img"
      aria-label={`Recent net trend across ${points.length} periods`}
    >
      {points.map((point) => {
        const ratio = Math.abs(point.net) / max;
        const heightPct = Math.max(ratio * 100, MIN_BAR_HEIGHT_PCT);
        const isPositive = point.net >= 0;
        return (
          <Tooltip
            key={`${point.label}-${point.net}-${point.income}-${point.expense}`}
          >
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "flex-1 cursor-default rounded-sm transition-all duration-300",
                    isPositive
                      ? "bg-chart-1/30 group-hover/card:bg-chart-1/60"
                      : "bg-destructive/30 group-hover/card:bg-destructive/60",
                  )}
                  style={{ height: `${heightPct}%` }}
                  aria-label={`${point.label} net ${point.net}`}
                />
              }
            />
            <TooltipContent>
              <p className="text-sm">
                {point.label}:{" "}
                <span
                  className={cn(
                    "font-medium",
                    isPositive ? "text-primary" : "text-destructive",
                  )}
                >
                  {formatPlain(point.net)}
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
