import { PiggyBankIcon } from "lucide-react";

import { cn } from "~/lib/utils";

import type { RingTone } from "./types";

type SavingsRingProps = {
  value: number;
  tone: RingTone;
  dimmed: boolean;
};

const RADIUS = 16;

export function SavingsRing({ value, tone, dimmed }: SavingsRingProps) {
  const circumference = 2 * Math.PI * RADIUS;
  const dashOffset = circumference * (1 - value);

  const stroke =
    tone === "emerald"
      ? "stroke-emerald-500 dark:stroke-emerald-400"
      : tone === "amber"
        ? "stroke-amber-500 dark:stroke-amber-400"
        : "stroke-destructive";

  return (
    <svg
      viewBox="0 0 40 40"
      className={cn(
        "size-12 shrink-0 -rotate-90 transition-opacity",
        dimmed ? "opacity-40" : "opacity-100",
      )}
      role="img"
      aria-label={`Savings ratio ${(value * 100).toFixed(0)} percent`}
    >
      <PiggyBankIcon className="hidden" />
      <circle
        cx="20"
        cy="20"
        r={RADIUS}
        className="stroke-foreground/10 fill-none"
        strokeWidth={4}
      />
      <circle
        cx="20"
        cy="20"
        r={RADIUS}
        className={cn(
          "fill-none transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none",
          stroke,
        )}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}
