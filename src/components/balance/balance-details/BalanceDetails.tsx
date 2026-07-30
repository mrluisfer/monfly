import { memo } from "react";

import { Alert, AlertTitle } from "~/components/ui/alert";

import { useCurrency } from "~/hooks/useCurrency";

import { BalanceDetailsSkeleton } from "./BalanceDetailsSkeleton";
import { BalanceInsights } from "./BalanceInsights";
import { BalanceMetricsGrid } from "./BalanceMetricsGrid";
import { EmptyInsights } from "./EmptyInsights";
import { RangeStrip } from "./RangeStrip";
import { useBalanceDetails } from "./use-balance-details";

function BalanceDetailsComponent() {
  const { isHidden: isBalanceHidden } = useCurrency();
  const { summary, isPending, error } = useBalanceDetails();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load balance details</AlertTitle>
      </Alert>
    );
  }

  if (isPending) {
    return <BalanceDetailsSkeleton />;
  }

  const hasData = summary.recentPoints.length > 0;
  const { bestPoint, worstPoint } = summary;
  const canShowRange = hasData && bestPoint && worstPoint && !isBalanceHidden;

  return (
    <section className="space-y-3" aria-label="Balance details and insights">
      <BalanceMetricsGrid summary={summary} />

      {hasData ? <BalanceInsights summary={summary} /> : <EmptyInsights />}

      {canShowRange ? <RangeStrip best={bestPoint} worst={worstPoint} /> : null}
    </section>
  );
}

export const BalanceDetails = memo(BalanceDetailsComponent);
