import { cn } from "~/lib/utils";

import { TONE_FILL, type Tone } from "./tone";

type FlowBarProps = {
  ratio: number;
  tone: Tone;
  ariaLabel: string;
  /** Bar thickness; defaults to the compact 1.5 used inside metric tiles. */
  className?: string;
};

export function FlowBar({ ratio, tone, ariaLabel, className }: FlowBarProps) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div
      className={cn(
        "bg-foreground/5 h-1.5 overflow-hidden rounded-full",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
          TONE_FILL[tone],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
