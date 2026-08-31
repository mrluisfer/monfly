import { MetricsGrid } from "~/components/shared/MetricsGrid";
import { Skeleton } from "~/components/ui/skeleton";

const METRIC_PLACEHOLDERS = [0, 1, 2];
const INSIGHT_PLACEHOLDERS = [0, 1, 2, 3];

export function BalanceDetailsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <MetricsGrid>
        {METRIC_PLACEHOLDERS.map((item) => (
          <Skeleton key={item} className="h-32 rounded-xl" />
        ))}
      </MetricsGrid>
      <MetricsGrid>
        {INSIGHT_PLACEHOLDERS.map((item) => (
          <Skeleton key={item} className="h-24 rounded-xl" />
        ))}
      </MetricsGrid>
    </div>
  );
}
