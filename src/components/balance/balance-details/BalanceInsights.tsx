import { FlameIcon, GaugeIcon, TimerIcon, TrophyIcon } from "lucide-react";

import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { formatCurrency } from "~/utils/format-currency";

import { HIDDEN_VALUE } from "./constants";
import { InsightCard } from "./InsightCard";
import { InsightsGrid } from "./InsightsGrid";
import { SavingsRateCard } from "./SavingsRateCard";
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
    <InsightsGrid>
      <SavingsRateCard rate={summary.savingsRate} hidden={isBalanceHidden} />

      <InsightCard
        icon={GaugeIcon}
        iconTone="text-sky-600 dark:text-sky-300"
        label="Avg net / period"
        value={
          isBalanceHidden
            ? HIDDEN_VALUE
            : formatCurrency(summary.avgNet, currency)
        }
        valueTone={summary.avgNet >= 0 ? "text-primary" : "text-destructive"}
        hint={`across ${periodCount} period${periodCount === 1 ? "" : "s"}`}
      />

      <InsightCard
        icon={TrophyIcon}
        iconTone="text-amber-600 dark:text-amber-300"
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
            ? "text-primary"
            : "text-foreground"
        }
        hint={summary.bestPoint?.label ?? "—"}
      />

      {summary.runwayMonths !== null ? (
        <InsightCard
          icon={TimerIcon}
          iconTone="text-destructive"
          label="Estimated runway"
          value={`${summary.runwayMonths.toFixed(1)} mo`}
          valueTone="text-destructive"
          hint="at current burn rate"
        />
      ) : (
        <InsightCard
          icon={FlameIcon}
          iconTone="text-emerald-600 dark:text-emerald-300"
          label="Positive streak"
          value={`${summary.positiveStreak} ${
            summary.positiveStreak === 1 ? "month" : "months"
          }`}
          valueTone={
            summary.positiveStreak > 0
              ? "text-primary"
              : "text-muted-foreground"
          }
          hint={
            summary.positiveStreak > 0
              ? "consecutive positive net"
              : "no streak yet"
          }
        />
      )}
    </InsightsGrid>
  );
}
