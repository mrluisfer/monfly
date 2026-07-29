import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { formatCurrency } from "~/utils/format-currency";

import { HIDDEN_VALUE } from "./constants";
import { FlowBar } from "~/components/shared/FlowBar";
import { MetricsGrid } from "~/components/shared/MetricsGrid";
import { MetricTile } from "~/components/shared/MetricTile";
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
  const latestTone = isLatestPositive ? "primary" : "destructive";

  const totalFlow = summary.totalIncome + summary.totalExpenses;
  const incomeRatio = totalFlow > 0 ? summary.totalIncome / totalFlow : 0;
  const expenseRatio = totalFlow > 0 ? summary.totalExpenses / totalFlow : 0;

  const sparkMax = summary.recentPoints.reduce(
    (max, point) => Math.max(max, Math.abs(point.net)),
    0,
  );

  return (
    <MetricsGrid>
      <MetricTile
        label="Latest net"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.latestPoint?.net ?? 0, currency)
        }
        valueTone={latestTone}
        icon={isLatestPositive ? ArrowUpRightIcon : ArrowDownRightIcon}
        iconTone={latestTone}
        aside={
          summary.trendPercent !== null && !isBalanceHidden ? (
            <TrendBadge percent={summary.trendPercent} />
          ) : null
        }
        footer={
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">
              {summary.latestPoint?.label ?? "Latest period"}
            </p>
            {summary.recentPoints.length > 1 && !isBalanceHidden ? (
              <Sparkline points={summary.recentPoints} max={sparkMax} />
            ) : null}
          </div>
        }
      />

      <MetricTile
        label="Income tracked"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.totalIncome, currency)
        }
        icon={TrendingUpIcon}
        iconTone="success"
        footer={
          <div className="space-y-1.5">
            <p className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
              <span>
                {hasData
                  ? `${summary.recentPoints.length} recorded periods`
                  : "Recent recorded periods"}
              </span>
              {hasData && !isBalanceHidden ? (
                <span className="text-success font-medium tabular-nums">
                  {(incomeRatio * 100).toFixed(0)}%
                </span>
              ) : null}
            </p>
            <FlowBar
              ratio={incomeRatio}
              tone="success"
              ariaLabel="Income share of total flow"
            />
          </div>
        }
      />

      <MetricTile
        label="Expenses tracked"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.totalExpenses, currency)
        }
        icon={TrendingDownIcon}
        iconTone="warning"
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
                <span className="text-warning font-medium tabular-nums">
                  {(expenseRatio * 100).toFixed(0)}%
                </span>
              ) : null}
            </p>
            <FlowBar
              ratio={expenseRatio}
              tone="warning"
              ariaLabel="Expense share of total flow"
            />
          </div>
        }
      />
    </MetricsGrid>
  );
}
