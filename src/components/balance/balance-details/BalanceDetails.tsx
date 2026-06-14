import { useAtomValue } from "jotai";
import { memo } from "react";

import { hideBalanceAtom } from "@/state";

import { BalanceDetailsSkeleton } from "./BalanceDetailsSkeleton";
import { BalanceInsights } from "./BalanceInsights";
import { BalanceMetricsGrid } from "./BalanceMetricsGrid";
import { EmptyInsights } from "./EmptyInsights";
import { RangeStrip } from "./RangeStrip";
import { useBalanceDetails } from "./use-balance-details";

function BalanceDetailsComponent() {
  const isBalanceHidden = useAtomValue(hideBalanceAtom);
  const { summary, isPending, error } = useBalanceDetails();

  if (error) {
    return (
      <p className="text-destructive text-sm font-medium" role="alert">
        Failed to load balance details
      </p>
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
      <BalanceMetricsGrid summary={summary} isBalanceHidden={isBalanceHidden} />

      {hasData ? (
        <BalanceInsights summary={summary} isBalanceHidden={isBalanceHidden} />
      ) : (
        <EmptyInsights />
      )}

      {canShowRange ? <RangeStrip best={bestPoint} worst={worstPoint} /> : null}
    </section>
  );
}

export const BalanceDetails = memo(BalanceDetailsComponent);
