import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";

import { BalanceCard } from "./BalanceCard";
import { HIDDEN_VALUE } from "./constants";
import { FlowBar } from "./FlowBar";
import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";
import type { BalanceSummary } from "./types";

type BalanceMetricsGridProps = {
  summary: BalanceSummary;
  isBalanceHidden: boolean;
};

export function BalanceMetricsGrid({
  summary,
  isBalanceHidden,
}: BalanceMetricsGridProps) {
  const currency = usePreferredCurrency();
  const hasData = summary.recentPoints.length > 0;
  const isLatestPositive = (summary.latestPoint?.net ?? 0) >= 0;
  const TrendIcon = isLatestPositive ? ArrowUpRightIcon : ArrowDownRightIcon;
  const balanceToneClass = isLatestPositive
    ? "text-primary"
    : "text-destructive";

  const totalFlow = summary.totalIncome + summary.totalExpenses;
  const incomeRatio = totalFlow > 0 ? summary.totalIncome / totalFlow : 0;
  const expenseRatio = totalFlow > 0 ? summary.totalExpenses / totalFlow : 0;

  const sparkMax = summary.recentPoints.reduce(
    (max, point) => Math.max(max, Math.abs(point.net)),
    0,
  );

  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <BalanceCard
        accent={isLatestPositive ? "primary" : "destructive"}
        label="Latest net"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.latestPoint?.net ?? 0, currency)
        }
        valueClassName={cn("tabular-nums", balanceToneClass)}
        leadingIcon={<TrendIcon className={cn("size-4", balanceToneClass)} />}
        footer={
          <div className="flex items-end justify-between gap-3">
            <p className="text-muted-foreground text-xs">
              {summary.latestPoint?.label ?? "Latest period"}
            </p>
            {summary.trendPercent !== null && !isBalanceHidden ? (
              <TrendBadge percent={summary.trendPercent} />
            ) : null}
          </div>
        }
        tail={
          summary.recentPoints.length > 1 && !isBalanceHidden ? (
            <Sparkline points={summary.recentPoints} max={sparkMax} />
          ) : null
        }
      />

      <BalanceCard
        accent="emerald"
        label="Income tracked"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.totalIncome, currency)
        }
        leadingIcon={
          <TrendingUpIcon className="size-4 text-emerald-600 dark:text-emerald-300" />
        }
        footer={
          <div className="space-y-1.5">
            <p className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
              <span>
                {hasData
                  ? `${summary.recentPoints.length} recorded periods`
                  : "Recent recorded periods"}
              </span>
              {hasData && !isBalanceHidden ? (
                <span className="font-medium text-emerald-700 tabular-nums dark:text-emerald-300">
                  {(incomeRatio * 100).toFixed(0)}%
                </span>
              ) : null}
            </p>
            <FlowBar
              ratio={incomeRatio}
              tone="emerald"
              ariaLabel="Income share of total flow"
            />
          </div>
        }
      />

      <BalanceCard
        accent="amber"
        label="Expenses tracked"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.totalExpenses, currency)
        }
        leadingIcon={
          <TrendingDownIcon className="size-4 text-amber-600 dark:text-amber-300" />
        }
        footer={
          <div className="space-y-1.5">
            <p className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
              <span>
                {hasData
                  ? `~ ${
                      isBalanceHidden
                        ? HIDDEN_VALUE
                        : formatCurrency(summary.expenseBurnRate, currency)
                    } / period`
                  : "Recent recorded periods"}
              </span>
              {hasData && !isBalanceHidden ? (
                <span className="font-medium text-amber-700 tabular-nums dark:text-amber-300">
                  {(expenseRatio * 100).toFixed(0)}%
                </span>
              ) : null}
            </p>
            <FlowBar
              ratio={expenseRatio}
              tone="amber"
              ariaLabel="Expense share of total flow"
            />
          </div>
        }
      />
    </dl>
  );
}
