import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "~/lib/utils";

import { Skeleton } from "./skeleton";

const trendVariants = cva(
  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
  {
    variants: {
      direction: {
        up: "bg-success/10 text-success",
        down: "bg-destructive/10 text-destructive",
        flat: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { direction: "flat" },
  },
);

type Trend = {
  value: string;
  direction: "up" | "down" | "flat";
  label?: string;
};

type MetricCardProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: Trend;
  loading?: boolean;
  accent?: "primary" | "success" | "warning" | "info" | "destructive" | "muted";
};

const accentMap: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  primary: "from-primary/15 to-transparent",
  success: "from-success/15 to-transparent",
  warning: "from-warning/15 to-transparent",
  info: "from-info/15 to-transparent",
  destructive: "from-destructive/15 to-transparent",
  muted: "from-muted to-transparent",
};

const iconAccentMap: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

const TrendIcon = ({ direction }: { direction: Trend["direction"] }) => {
  if (direction === "up") return <ArrowUpRight className="size-3" />;
  if (direction === "down") return <ArrowDownRight className="size-3" />;
  return <Minus className="size-3" />;
};

export function MetricCard({
  label,
  value,
  helper,
  icon,
  trend,
  loading,
  accent = "muted",
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "group bg-card text-card-foreground border-border/60 relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4 shadow-xs transition-all hover:shadow-md",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        {icon && (
          <div
            aria-hidden="true"
            className={cn(
              "flex size-8 items-center justify-center rounded-lg [&>svg]:size-4",
              iconAccentMap[accent],
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="relative flex items-end justify-between gap-3">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-foreground text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {value}
          </p>
        )}
        {trend && !loading && (
          <span className={cn(trendVariants({ direction: trend.direction }))}>
            <TrendIcon direction={trend.direction} />
            {trend.value}
          </span>
        )}
      </div>
      {helper && !loading && (
        <p className="text-muted-foreground relative text-xs leading-relaxed">
          {helper}
        </p>
      )}
    </div>
  );
}
