import { createFileRoute } from "@tanstack/react-router";
import ChartByCategoryRadar from "~/components/charts/chart-by-category-radar";
import ChartTransactionsByMonth from "~/components/charts/chart-transactions-by-month";
import IncomeExpenseChart from "~/components/charts/income-expense-chart";
import { PageTitle } from "~/components/page-title";
import { transactionTypes } from "~/constants/transaction-types";

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
        <IncomeExpenseChart />
        <ChartTransactionsByMonth />
        <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
        <ChartByCategoryRadar type={transactionTypes.INCOME} />
      </div>
    </div>
  );
}
