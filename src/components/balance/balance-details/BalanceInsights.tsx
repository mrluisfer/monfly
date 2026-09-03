import { FlameIcon, GaugeIcon, TimerIcon, TrophyIcon } from "lucide-react";
import { MetricsGrid } from "~/components/shared/MetricsGrid";
import { MetricTile } from "~/components/shared/MetricTile";
import { useCurrency } from "~/hooks/useCurrency";
import { SavingsRateTile } from "./SavingsRateTile";
import type { BalanceSummary } from "./types";

interface BalanceInsightsProps {
  summary: BalanceSummary;
}

export function BalanceInsights({ summary }: BalanceInsightsProps) {
  const { format: formatAmount, isHidden } = useCurrency();
  const periodCount = summary.recentPoints.length;

  return (
    <MetricsGrid>
      <SavingsRateTile rate={summary.savingsRate} hidden={isHidden} />

      <MetricTile
        label="Avg net / period"
        value={formatAmount(summary.avgNet)}
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
        value={summary.bestPoint ? formatAmount(summary.bestPoint.net) : "—"}
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

      {summary.runwayMonths === null ? (
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
      ) : (
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
      )}
    </MetricsGrid>
  );
}
