import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

import { ACCENT_CLASS } from "./constants";
import type { AccentTone } from "./types";

type BalanceCardProps = {
  accent: AccentTone;
  label: string;
  value: string;
  valueClassName?: string;
  leadingIcon: ReactNode;
  footer: ReactNode;
  tail?: ReactNode;
};

export function BalanceCard({
  accent,
  label,
  value,
  valueClassName,
  leadingIcon,
  footer,
  tail,
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        "group/balance-card bg-muted ring-foreground/5 relative overflow-hidden rounded-2xl p-4 ring-1 transition-all duration-300",
        "hover:ring-foreground/10 hover:shadow-sm",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-60 before:transition-opacity before:duration-300 group-hover/balance-card:before:opacity-100",
        ACCENT_CLASS[accent],
      )}
    >
      <div className="relative flex flex-col gap-2.5">
        <dt className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
          <span className="bg-background/70 ring-foreground/5 inline-flex size-6 items-center justify-center rounded-full ring-1">
            {leadingIcon}
          </span>
          {label}
        </dt>
        <dd
          className={cn(
            "text-foreground text-lg font-semibold tracking-tight tabular-nums sm:text-xl",
            valueClassName,
          )}
        >
          {value}
        </dd>
        {tail}
        {footer}
      </div>
    </div>
  );
}
