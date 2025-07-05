import IncomeExpenseChart from "~/components/charts/income-expense-chart";
import clsx from "clsx";

const Charts = ({ className }: { className?: string }) => {
  return (
    <div className={clsx("", className)}>
      <IncomeExpenseChart />
    </div>
  );
};

export default Charts;
