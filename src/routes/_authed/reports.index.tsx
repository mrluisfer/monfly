import { createFileRoute } from "@tanstack/react-router";
import Card from "~/components/card";
import ChartByCategoryRadar from "~/components/charts/chart-by-category-radar";
import ChartTransactionsByMonth from "~/components/charts/chart-transactions-by-month";
import IncomeExpenseChart from "~/components/charts/income-expense-chart";
import { transactionTypes } from "~/constants/transaction-types";

export const Route = createFileRoute("/_authed/reports/")({
  component: RouteComponent,
});

export default function RouteComponent() {
  return (
    <Card
      className="mx-auto w-full"
      title="Reports & Analytics"
      subtitle="Visualize your transactions, incomes and expenses over time. Switch between tabs for different insights."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 grid-row-auto gap-4">
        <IncomeExpenseChart />
        <ChartTransactionsByMonth />
        <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
        <ChartByCategoryRadar type={transactionTypes.INCOME} />
      </div>
    </Card>
  );
}
