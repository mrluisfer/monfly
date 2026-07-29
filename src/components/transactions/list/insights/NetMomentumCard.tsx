import { useAtomValue } from "jotai";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { lazy, Suspense, useId } from "react";
import Card from "~/components/shared/Card";
import { ClientOnly } from "~/components/shared/ClientOnly";
import { MetricsGrid } from "~/components/shared/MetricsGrid";
import { MetricTile } from "~/components/shared/MetricTile";
import { Skeleton } from "~/components/ui/skeleton";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { maskCurrency } from "~/utils/format-currency";

// Lazy + client-only: a static import would pull recharts into this card's
// (server-rendered) module graph and crash the production build with
// "a is not a function". Keep recharts in a client-only async chunk.
const IncomeExpenseChart = lazy(
  () => import("@/components/charts/IncomeExpenseChart"),
);

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
  const hideBalance = useAtomValue(hideBalanceAtom);
  const gradientId = useId().replace(/:/g, "");
  const isPositiveLast30 = netLast30 >= 0;
  const trendColor = isPositiveLast30 ? "var(--primary)" : "var(--destructive)";

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <Card
        title="Net momentum"
        subtitle={`${maskCurrency(netLast30, currency, hideBalance)} in the last 30 days · 6-month trend`}
        cardContentProps={{ className: "space-y-4" }}
      >
        {/* ponytail: the trend sits directly on the card — the extra bordered
            inner panel was the main reason this card read differently from the
            chart card next to it. */}
        {sparkline ? (
          <div>
            <svg
              viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
              className="h-40 w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={trendColor} stopOpacity="0.24" />
                  <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
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

            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{monthlyPoints[0]?.label}</span>
              <span>{monthlyPoints.at(-1)?.label}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Add more transactions to render momentum insights.
          </p>
        )}

        <MetricsGrid>
          <MetricTile
            label="Income (30d)"
            value={maskCurrency(incomeLast30, currency, hideBalance)}
            valueTone="primary"
            icon={TrendingUpIcon}
            iconTone="success"
          />
          <MetricTile
            label="Expenses (30d)"
            value={maskCurrency(expenseLast30, currency, hideBalance)}
            valueTone="destructive"
            icon={TrendingDownIcon}
            iconTone="warning"
          />
        </MetricsGrid>
      </Card>

      <ClientOnly fallback={<Skeleton className="h-72 w-full rounded-xl" />}>
        <Suspense fallback={<Skeleton className="h-72 w-full rounded-xl" />}>
          <IncomeExpenseChart />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
