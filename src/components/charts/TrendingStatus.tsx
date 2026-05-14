import { TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";
import { TransactionType } from "~/constants/transaction-types";
import { formatCurrency } from "~/utils/format-currency";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getTrendingIcon = (percentChange: number) => {
  if (percentChange > 0) return <TrendingUp className="text-primary size-4" />;
  if (percentChange < 0)
    return <TrendingDown className="text-destructive size-4" />;
  return <TrendingUpDown className="text-muted-foreground size-4" />;
};

export function TrendingStatus({
  type,
  data,
}: {
  type: TransactionType;
  data?: {
    thisMonthTotal?: number;
    lastMonthTotal?: number;
    percentChange?: number;
  };
}) {
  const {
    thisMonthTotal = 0,
    lastMonthTotal = 0,
    percentChange = 0,
  } = data || {};

  // Validate and sanitize data
  const safeThisMonth = Number.isFinite(thisMonthTotal) ? thisMonthTotal : 0;
  const safeLastMonth = Number.isFinite(lastMonthTotal) ? lastMonthTotal : 0;
  const safePercentChange = Number.isFinite(percentChange) ? percentChange : 0;

  const formattedType = type === "income" ? "Received" : "Spent";
  const isPositive = safePercentChange > 0;
  const isNegative = safePercentChange < 0;
  const isNeutral = safePercentChange === 0;

  // Enhanced badge colors with dark mode support
  const badgeVariant = isPositive
    ? "default"
    : isNegative
      ? "destructive"
      : "secondary";

  const badgeColorClasses = isPositive
    ? "bg-primary/10 text-primary border-primary/25"
    : isNegative
      ? "bg-destructive/10 text-destructive border-destructive/25"
      : "bg-muted text-muted-foreground border-border";

  const changeLabel = isPositive
    ? "more than"
    : isNegative
      ? "less than"
      : "the same as";

  return (
    <TooltipProvider>
      <div className="mt-2 flex flex-col gap-2">
        {/* Current Month Display */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-muted-foreground text-xs font-medium sm:text-sm">
            {formattedType} this month:
          </span>
          <span className="text-foreground text-sm font-bold sm:text-base">
            {formatCurrency(safeThisMonth, "USD")}
          </span>
        </div>

        {/* Comparison Display */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              vs. {formatCurrency(safeLastMonth, "USD")}
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex items-center gap-1">
                    {getTrendingIcon(safePercentChange)}
                    <Badge
                      variant={badgeVariant}
                      className={`border px-2 py-0.5 text-xs font-semibold ${badgeColorClasses}`}
                    >
                      {isNeutral
                        ? "0%"
                        : `${safePercentChange >= 0 ? "+" : ""}${Math.abs(safePercentChange).toFixed(1)}%`}
                    </Badge>
                  </div>
                }
              />
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1 text-xs">
                  <p>
                    <strong>This month:</strong>{" "}
                    {formatCurrency(safeThisMonth, "USD")}
                  </p>
                  <p>
                    <strong>Last month:</strong>{" "}
                    {formatCurrency(safeLastMonth, "USD")}
                  </p>
                  <p>
                    <strong>Change:</strong> {safePercentChange >= 0 ? "+" : ""}
                    {safePercentChange.toFixed(1)}%
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {isPositive &&
                      type === "income" &&
                      "📈 Great! Your income increased"}
                    {isPositive &&
                      type === "expense" &&
                      "⚠️ Your expenses increased"}
                    {isNegative &&
                      type === "income" &&
                      "📉 Your income decreased"}
                    {isNegative &&
                      type === "expense" &&
                      "✅ Good! Your expenses decreased"}
                    {isNeutral && "➡️ No change from last month"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {!isNeutral && (
            <span className="text-muted-foreground hidden text-xs sm:block">
              {changeLabel} last month
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
