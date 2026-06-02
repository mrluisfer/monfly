import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";

import { cn } from "~/lib/utils";

type TrendBadgeProps = {
  percent: number;
};

export function TrendBadge({ percent }: TrendBadgeProps) {
  const isPositive = percent >= 0;
  const Icon = isPositive ? ArrowUpRightIcon : ArrowDownRightIcon;
  const formatted = `${isPositive ? "+" : ""}${percent.toFixed(1)}%`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums",
        isPositive
          ? "bg-primary/10 text-primary"
          : "bg-destructive/10 text-destructive",
      )}
      aria-label={`Change vs previous period ${formatted}`}
    >
      <Icon className="size-3" aria-hidden="true" />
      {formatted}
    </span>
  );
}
