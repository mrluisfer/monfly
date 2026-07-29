import { FlameIcon, GaugeIcon, TimerIcon, TrophyIcon } from "lucide-react";

import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { formatCurrency } from "~/utils/format-currency";

import { HIDDEN_VALUE } from "./constants";
import { MetricsGrid } from "~/components/shared/MetricsGrid";
import { MetricTile } from "~/components/shared/MetricTile";
import { SavingsRateTile } from "./SavingsRateTile";
import type { BalanceSummary } from "./types";

type BalanceInsightsProps = {
  summary: BalanceSummary;
  isBalanceHidden: boolean;
};

export function BalanceInsights({
  summary,
  isBalanceHidden,
}: BalanceInsightsProps) {
  const currency = usePreferredCurrency();
  const periodCount = summary.recentPoints.length;

  return (
    <MetricsGrid>
      <SavingsRateTile rate={summary.savingsRate} hidden={isBalanceHidden} />

      <MetricTile
        label="Avg net / period"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.avgNet, currency)
        }
        valueTone={summary.avgNet >= 0 ? "primary" : "destructive"}
        icon={GaugeIcon}
        iconTone="info"
        footer={
          <p className="text-muted-foreground text-xs">
            {`across ${periodCount} period${periodCount === 1 ? "" : "s"}`}
          </p>
        }
      />

      <MetricTile
        label="Best period"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : summary.bestPoint
              ? formatCurrency(summary.bestPoint.net, currency)
              : "—"
        }
        valueTone={
          summary.bestPoint && summary.bestPoint.net >= 0
            ? "primary"
            : "neutral"
        }
        icon={TrophyIcon}
        iconTone="warning"
        footer={
          <p className="text-muted-foreground text-xs">
            {summary.bestPoint?.label ?? "—"}
          </p>
        }
      />

      {summary.runwayMonths !== null ? (
        <MetricTile
          label="Estimated runway"
          value={`${summary.runwayMonths.toFixed(1)} mo`}
          valueTone="destructive"
          icon={TimerIcon}
          iconTone="destructive"
          footer={
            <p className="text-muted-foreground text-xs">
              at current burn rate
            </p>
          }
        />
      ) : (
        <MetricTile
          label="Positive streak"
          value={`${summary.positiveStreak} ${
            summary.positiveStreak === 1 ? "month" : "months"
          }`}
          valueTone={summary.positiveStreak > 0 ? "primary" : "neutral"}
          icon={FlameIcon}
          iconTone="success"
          footer={
            <p className="text-muted-foreground text-xs">
              {summary.positiveStreak > 0
                ? "consecutive positive net"
                : "no streak yet"}
            </p>
          }
        />
      )}
    </MetricsGrid>
  );
}
