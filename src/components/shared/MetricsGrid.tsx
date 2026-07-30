import type { ReactNode } from "react";

/**
 * Shared layout for every tile row (metrics, insights, skeletons).
 * ponytail: `auto-fit` instead of per-breakpoint column counts — both rows
 * derive the same column width from the same min size, so they line up at any
 * container width without a breakpoint matrix to keep in sync.
 */
export function MetricsGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(10.5rem,1fr))] gap-3">
      {children}
    </dl>
  );
}
