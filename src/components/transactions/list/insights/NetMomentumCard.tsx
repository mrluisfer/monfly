import { useId } from "react";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";

import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";

type MonthlyPoint = {
  count: number;
  expense: number;
  income: number;
  label: string;
  net: number;
};

type SparklineData = {
  height: number;
  lastPoint: string[];
  padding: number;
  points: string;
  width: number;
} | null;

type NetMomentumCardProps = {
  expenseLast30: number;
  incomeLast30: number;
  monthlyPoints: MonthlyPoint[];
  netLast30: number;
  sparkline: SparklineData;
};

export function NetMomentumCard({
  expenseLast30,
  incomeLast30,
  monthlyPoints,
  netLast30,
  sparkline,
}: NetMomentumCardProps) {
  const currency = usePreferredCurrency();
  const gradientId = useId().replace(/:/g, "");
  const isPositiveLast30 = netLast30 >= 0;
  const trendColor = isPositiveLast30 ? "var(--primary)" : "var(--destructive)";

  const last30Stats = [
    {
      label: "Income (30d)",
      value: formatCurrency(incomeLast30, currency),
      valueClassName: "text-primary",
    },
    {
      label: "Expenses (30d)",
      value: formatCurrency(expenseLast30, currency),
      valueClassName: "text-destructive",
    },
  ] as const;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <article className="bg-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Net momentum (last 6 months)
            </p>
            <h4 className="text-foreground mt-1 text-lg font-semibold tracking-tight">
              {formatCurrency(netLast30, currency)} in last 30 days
            </h4>
          </div>
          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs">
            Updated from your current transactions
          </span>
        </div>

        <div className="border-border/70 bg-background/55 mt-4 rounded-2xl border p-3">
          {sparkline ? (
            <div>
              <svg
                viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
                className="h-40 w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={trendColor}
                      stopOpacity="0.24"
                    />
                    <stop
                      offset="100%"
                      stopColor={trendColor}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <polygon
                  points={`${sparkline.padding},${sparkline.height - sparkline.padding} ${sparkline.points} ${sparkline.width - sparkline.padding},${sparkline.height - sparkline.padding}`}
                  fill={`url(#${gradientId})`}
                  stroke="none"
                />
                <polyline
                  points={sparkline.points}
                  fill="none"
                  stroke={trendColor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.6"
                />
                <circle
                  cx={sparkline.lastPoint[0]}
                  cy={sparkline.lastPoint[1]}
                  r="5"
                  fill={trendColor}
                />
              </svg>

              <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                <span>{monthlyPoints[0]?.label}</span>
                <span>{monthlyPoints.at(-1)?.label}</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Add more transactions to render momentum insights.
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {last30Stats.map((stat) => (
            <div key={stat.label} className="bg-muted rounded-xl p-3">
              <div className="text-muted-foreground text-xs font-medium tracking-[0.15em] uppercase">
                {stat.label}
              </div>
              <div
                className={cn(
                  "mt-2 text-base font-semibold",
                  stat.valueClassName,
                )}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </article>

      <IncomeExpenseChart />
    </div>
  );
}
