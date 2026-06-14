import { Skeleton } from "~/components/ui/skeleton";

import { InsightsGrid } from "./InsightsGrid";

const METRIC_PLACEHOLDERS = [0, 1, 2];
const INSIGHT_PLACEHOLDERS = [0, 1, 2, 3];

export function BalanceDetailsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <dl className="grid gap-3 sm:grid-cols-3">
        {METRIC_PLACEHOLDERS.map((item) => (
          <Skeleton key={item} className="h-32 rounded-2xl" />
        ))}
      </dl>
      <InsightsGrid>
        {INSIGHT_PLACEHOLDERS.map((item) => (
          <Skeleton key={item} className="h-24 rounded-2xl" />
        ))}
      </InsightsGrid>
    </div>
  );
}
