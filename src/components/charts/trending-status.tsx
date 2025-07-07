import { TransactionType } from "~/constants/transaction-types";
import { TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const getTrendingIcon = (percentChange: number) => {
  if (percentChange > 0)
    return <TrendingUp className="h-5 w-5 text-green-600" />;
  if (percentChange < 0)
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  return <TrendingUpDown className="h-5 w-5 text-muted-foreground" />;
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
  const formattedType = type === "income" ? "Received" : "Spent";
  const isPositive = percentChange > 0;
  const badgeColor = isPositive
    ? "bg-green-100 text-green-700 border-green-200"
    : percentChange < 0
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-muted text-muted-foreground border-muted-foreground/20";
  const changeLabel =
    percentChange > 0
      ? "more than"
      : percentChange < 0
        ? "less than"
        : "the same as";

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex items-center gap-2 text-base font-semibold">
        <span className="text-muted-foreground">
          {formattedType} this month:
        </span>
        <span className="text-primary">${thisMonthTotal.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Last month:</span>
        <span className="text-primary">${lastMonthTotal.toLocaleString()}</span>
        {getTrendingIcon(percentChange)}
        <Badge className={`px-2 py-0.5 border ${badgeColor}`}>
          {Math.abs(percentChange).toFixed(1)}%
        </Badge>
        <span className="text-muted-foreground">{changeLabel} last month</span>
      </div>
    </div>
  );
}
