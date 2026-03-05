import { TransactionType } from "~/constants/transaction-types";
import { formatCurrency } from "~/utils/format-currency";
import { TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getTrendingIcon = (percentChange: number) => {
  if (percentChange > 0)
    return (
      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    );
  if (percentChange < 0)
    return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
  return <TrendingUpDown className="h-4 w-4 text-muted-foreground" />;
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
    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
    : isNegative
      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600";

  const changeLabel = isPositive
    ? "more than"
    : isNegative
      ? "less than"
      : "the same as";

  return (
    <TooltipProvider delay={300}>
      <div className="flex flex-col gap-2 mt-2">
        {/* Current Month Display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            {formattedType} this month:
          </span>
          <span className="text-sm sm:text-base font-bold text-foreground">
            {formatCurrency(safeThisMonth, "USD")}
          </span>
        </div>

        {/* Comparison Display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              vs. {formatCurrency(safeLastMonth, "USD")}
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex items-center gap-1">
                    {getTrendingIcon(safePercentChange)}
                    <Badge
                      variant={badgeVariant}
                      className={`px-2 py-0.5 text-xs font-semibold border ${badgeColorClasses}`}
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
            <span className="text-xs text-muted-foreground hidden sm:block">
              {changeLabel} last month
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
