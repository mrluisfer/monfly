import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { ClientOnly } from "~/components/shared/ClientOnly";
import { Skeleton } from "~/components/ui/skeleton";
import { transactionTypes } from "~/constants/transaction-types";
import { BarChartIcon } from "lucide-react";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/IncomeExpenseChart"),
);
const ChartTransactionsByMonth = lazy(
  () => import("~/components/charts/ChartTransactionsByMonth"),
);
const ChartByCategoryRadar = lazy(
  () => import("~/components/charts/ChartByCategoryRadar"),
);

export const Route = createFileRoute("/_authed/home/reports/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={<BarChartIcon className="size-5" aria-hidden="true" />}
        title="Reports & Analytics"
        description="Visualize your financial trends and category breakdowns."
      />

      {/* Charts are browser-only (recharts): rendering them on the server
          crashes during SSR and causes hydration mismatches, so they are
          gated behind ClientOnly and only render after mount. */}
      <ClientOnly fallback={<ChartsFallback />}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Suspense fallback={<ChartFallback />}>
            <IncomeExpenseChart />
          </Suspense>
          <Suspense fallback={<ChartFallback />}>
            <ChartTransactionsByMonth />
          </Suspense>
          <Suspense fallback={<ChartFallback />}>
            <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
          </Suspense>
          <Suspense fallback={<ChartFallback />}>
            <ChartByCategoryRadar type={transactionTypes.INCOME} />
          </Suspense>
        </div>
      </ClientOnly>
    </div>
  );
}

function ChartFallback() {
  return <Skeleton className="h-72 w-full rounded-2xl" />;
}

function ChartsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <ChartFallback key={item} />
      ))}
    </div>
  );
}
