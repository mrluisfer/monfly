import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "~/components/page-title";
import { Skeleton } from "~/components/ui/skeleton";
import { transactionTypes } from "~/constants/transaction-types";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/income-expense-chart")
);
const ChartTransactionsByMonth = lazy(
  () => import("~/components/charts/chart-transactions-by-month")
);
const ChartByCategoryRadar = lazy(
  () => import("~/components/charts/chart-by-category-radar")
);

export const Route = createFileRoute("/_authed/reports/")({
  component: RouteComponent,
});

export default function RouteComponent() {
  return (
    <div>
      <header className="mb-6 flex justify-between items-center">
        <PageTitle description="This is your reports and analytics dashboard">
          Reports & Analytics
        </PageTitle>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-row-auto gap-4">
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
    </div>
  );
}

function ChartFallback() {
  return <Skeleton className="h-72 w-full" />;
}
