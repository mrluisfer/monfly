import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";

import { BALANCE_CURRENCY } from "./constants";
import type { IncomeExpensePoint } from "./types";

type SparklineProps = {
  points: IncomeExpensePoint[];
  max: number;
};

/** Minimum bar height (in %) so near-zero periods stay visible. */
const MIN_BAR_HEIGHT_PCT = 6;

export function Sparkline({ points, max }: SparklineProps) {
  if (max <= 0) return null;
  return (
    <div
      className="flex h-8 items-end gap-1"
      role="img"
      aria-label={`Recent net trend across ${points.length} periods`}
    >
      {points.map((point, index) => {
        const ratio = Math.abs(point.net) / max;
        const heightPct = Math.max(ratio * 100, MIN_BAR_HEIGHT_PCT);
        const isPositive = point.net >= 0;
        return (
          <Tooltip key={`${point.label}-${index}`}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "flex-1 cursor-default rounded-sm transition-all duration-300",
                    isPositive
                      ? "bg-primary/30 group-hover/balance-card:bg-primary/60"
                      : "bg-destructive/30 group-hover/balance-card:bg-destructive/60",
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
                  {formatCurrency(point.net, BALANCE_CURRENCY)}
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
