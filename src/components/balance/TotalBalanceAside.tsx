import { ActivityIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";

import type {
  BalanceTone,
  MonthlyPoint,
  TotalBalanceSummary,
} from "./TotalBalance";

type TotalBalanceAsideProps = {
  summary: TotalBalanceSummary;
  balanceTone: BalanceTone;
  balanceToneClass: string;
};

export const TotalBalanceAside = ({
  summary,
  balanceTone,
  balanceToneClass,
}: TotalBalanceAsideProps) => {
  return (
    <aside className="finance-soft-chart rounded-[1.75rem] p-4 sm:p-5 hidden lg:block">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Trend</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Balance over time
          </h2>
        </div>

        <span className="text-sm text-muted-foreground">
          {summary.recentPoints.length} periods
        </span>
      </div>

      <div className="mt-5">
        <Sparkline data={summary.recentPoints} tone={balanceTone} />
      </div>

      <div className="mt-5">
        <div className="rounded-[1.15rem] border border-border/70 bg-background/65 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ActivityIcon className="size-4 text-primary" />
            Change vs previous period
          </div>
          <p className={cn("mt-3 text-base font-semibold", balanceToneClass)}>
            {summary.trendDelta === null
              ? "Not enough data"
              : formatCurrency(summary.trendDelta, "USD")}
          </p>
          {summary.peakPoint && (
            <p className="mt-2 text-xs text-muted-foreground">
              Peak period: {summary.peakPoint.label} (
              {formatCurrency(summary.peakPoint.net, "USD")})
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
function Sparkline({
  data,
  tone,
}: {
  data: MonthlyPoint[];
  tone: "positive" | "negative";
}) {
  if (data.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[1.5rem] border border-dashed border-border/70 bg-background/50 px-5 text-center text-sm text-muted-foreground">
        Add a few transactions to reveal your balance momentum over time.
      </div>
    );
  }

  const width = 420;
  const height = 180;
  const padding = 12;
  const values = data.map((point) => point.net);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data
    .map((point, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y =
        height - padding - ((point.net - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const lastPoint = points.split(" ").at(-1)?.split(",") ?? ["0", "0"];
  const strokeColor =
    tone === "positive" ? "hsl(152 76% 40%)" : "hsl(0 72% 51%)";
  const fillId = tone === "positive" ? "sparkPositive" : "sparkNegative";

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon
          points={`12,${height - padding} ${points} ${width - padding},${height - padding}`}
          fill={`url(#${fillId})`}
          stroke="none"
        />
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r="7"
          fill={strokeColor}
          fillOpacity="0.16"
        />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill={strokeColor} />
      </svg>

      <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
