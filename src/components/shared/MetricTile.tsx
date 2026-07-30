import type { ComponentType, ReactNode } from "react";

import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { TONE_TEXT, type Tone } from "./tone";

type MetricTileProps = {
  label: string;
  value: ReactNode;
  /** Tint for the value; defaults to plain foreground. */
  valueTone?: Tone;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  iconTone?: Tone;
  /** Rendered to the right of the value (trend badge, savings ring…). */
  aside?: ReactNode;
  /** Rendered under the value (hint text, flow bar, sparkline…). */
  footer?: ReactNode;
};

/**
 * The single stat tile used across the app (balance metrics, insights, chart
 * footers). One component is what keeps every tile row visually identical —
 * it replaced four near-duplicate implementations.
 * Must be rendered inside a `MetricsGrid` (it emits `dt`/`dd`).
 */
export function MetricTile({
  label,
  value,
  valueTone = "neutral",
  icon: Icon,
  iconTone = "neutral",
  aside,
  footer,
}: MetricTileProps) {
  return (
    <Card
      size="sm"
      className="px-(--card-spacing) transition-shadow hover:shadow-sm"
    >
      <dt className="text-muted-foreground flex items-center justify-between gap-2 text-[0.7rem] font-medium tracking-[0.12em] uppercase">
        <span className="truncate">{label}</span>
        {Icon ? (
          <Icon
            className={cn("size-4 shrink-0", TONE_TEXT[iconTone])}
            aria-hidden={true}
          />
        ) : null}
      </dt>
      <dd className="space-y-2">
        <div className="flex items-end justify-between gap-3">
          <span
            className={cn(
              "block text-lg font-semibold tracking-tight tabular-nums sm:text-xl",
              valueTone === "neutral"
                ? "text-foreground"
                : TONE_TEXT[valueTone],
            )}
          >
            {value}
          </span>
          {aside}
        </div>
        {footer}
      </dd>
    </Card>
  );
}
