import { TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TransactionType } from "~/constants/transaction-types";
import { useCurrency } from "~/hooks/useCurrency";

const getTrendingIcon = (percentChange: number) => {
  if (percentChange > 0) {
    return <TrendingUp className="size-4 text-primary" />;
  }
  if (percentChange < 0) {
    return <TrendingDown className="size-4 text-destructive" />;
  }
  return <TrendingUpDown className="size-4 text-muted-foreground" />;
};

/** Badge variant, colours and wording for each direction of travel. */
const TREND_PRESENTATION = {
  down: {
    badgeColorClasses:
      "bg-destructive/10 text-destructive border-destructive/25",
    badgeVariant: "destructive",
    changeLabel: "less than",
  },
  flat: {
    badgeColorClasses: "bg-muted text-muted-foreground border-border",
    badgeVariant: "secondary",
    changeLabel: "the same as",
  },
  up: {
    badgeColorClasses: "bg-primary/10 text-primary border-primary/25",
    badgeVariant: "default",
    changeLabel: "more than",
  },
} as const;

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
  const { formatPlain } = useCurrency();
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
  let trend: keyof typeof TREND_PRESENTATION = "flat";
  if (isPositive) {
    trend = "up";
  } else if (isNegative) {
    trend = "down";
  }
  const { badgeColorClasses, badgeVariant, changeLabel } =
    TREND_PRESENTATION[trend];

  return (
    <TooltipProvider>
      <div className="mt-2 flex flex-col gap-2">
        {/* Current Month Display */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="font-medium text-muted-foreground text-xs sm:text-sm">
            {formattedType} this month:
          </span>
          <span className="font-bold text-foreground text-sm sm:text-base">
            {formatPlain(safeThisMonth)}
          </span>
        </div>

        {/* Comparison Display */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              vs. {formatPlain(safeLastMonth)}
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex items-center gap-1">
                    {getTrendingIcon(safePercentChange)}
                    <Badge
                      variant={badgeVariant}
                      className={`border px-2 py-0.5 font-semibold text-xs ${badgeColorClasses}`}
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
                    <strong>This month:</strong> {formatPlain(safeThisMonth)}
                  </p>
                  <p>
                    <strong>Last month:</strong> {formatPlain(safeLastMonth)}
                  </p>
                  <p>
                    <strong>Change:</strong> {safePercentChange >= 0 ? "+" : ""}
                    {safePercentChange.toFixed(1)}%
                  </p>
                  <p className="mt-2 text-muted-foreground">
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
            <span className="hidden text-muted-foreground text-xs sm:block">
              {changeLabel} last month
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
