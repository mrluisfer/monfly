import IncomeExpenseChart from "~/components/charts/income-expense-chart";
import { transactionTypes } from "~/constants/transaction-types";
import clsx from "clsx";

import ChartByCategoryRadar from "./chart-by-category-radar";

const Charts = ({ className }: { className?: string }) => {
  return (
    <div className={clsx("max-w-md", className)}>
      <div className="md:hidden xl:block">
        <IncomeExpenseChart />
      </div>
      <div className="hidden md:block xl:hidden">
        <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
      </div>
    </div>
  );
};

export default Charts;
