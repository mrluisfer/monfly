import { SquareActivityIcon } from "lucide-react";
import { lazy, Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

const SpendingHeatmap = lazy(
  () => import("~/components/charts/SpendingHeatmap"),
);

export function DailyActivity() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<SquareActivityIcon className="size-5" aria-hidden="true" />}
        title="Daily activity"
        description="Spot your cashflow rhythm day by day."
      />
      <Suspense fallback={<Skeleton className="h-56 w-full rounded-2xl" />}>
        <SpendingHeatmap />
      </Suspense>
    </div>
  );
}
