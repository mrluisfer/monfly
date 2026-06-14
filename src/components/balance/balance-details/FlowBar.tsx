import { cn } from "~/lib/utils";

import type { FlowTone } from "./types";

type FlowBarProps = {
  ratio: number;
  tone: FlowTone;
  ariaLabel: string;
};

export function FlowBar({ ratio, tone, ariaLabel }: FlowBarProps) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div
      className="bg-foreground/5 h-1.5 overflow-hidden rounded-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
          tone === "emerald"
            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
            : "bg-gradient-to-r from-amber-400 to-amber-600",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
