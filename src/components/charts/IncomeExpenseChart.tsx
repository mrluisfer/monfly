"use client";

import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { DollarSign } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import Card from "../shared/Card";
import { ChartError, ChartLoading } from "./ChartLoading";

type IncomeExpenseTooltipProps = {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
};

function IncomeExpenseTooltip({
  active,
  payload,
  label,
}: IncomeExpenseTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
  const net = income - expense;

  return (
    <div className="bg-background/95 border-border min-w-[200px] rounded-lg border p-4 shadow-lg backdrop-blur-sm">
      <p className="text-foreground mb-2 font-semibold">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary size-3 rounded-full" />
            <span className="text-muted-foreground text-sm">Income:</span>
          </div>
          <span className="text-primary font-semibold">
            {formatCurrency(income, "USD")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-destructive size-3 rounded-full" />
            <span className="text-muted-foreground text-sm">Expenses:</span>
          </div>
          <span className="text-destructive font-semibold">
            {formatCurrency(expense, "USD")}
          </span>
        </div>
        <div className="border-border border-t pt-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground text-sm font-medium">
              Net:
            </span>
            <span
              className={`font-bold ${net >= 0 ? "text-primary" : "text-destructive"}`}
            >
              {net >= 0 ? "+" : ""}
              {formatCurrency(net, "USD")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IncomeExpenseChart() {
  const userEmail = useRouteUser();

  const { data, isLoading, error } = useQuery({
    queryKey: [queryDictionary.incomeExpenseData, userEmail],
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  // Process and validate chart data
  const rawChartData = data?.data ?? [];
  const chartData = rawChartData.map(
    (item: { month?: unknown; income?: unknown; expense?: unknown }) => {
      const rawIncome = Number(item.income);
      const rawExpense = Number(item.expense);
      const income = Number.isFinite(rawIncome) ? Math.max(0, rawIncome) : 0;
      const expense = Number.isFinite(rawExpense) ? Math.max(0, rawExpense) : 0;
      return {
        month: String(item.month || "Unknown"),
        income,
        expense,
        net:
          (Number.isFinite(rawIncome) ? rawIncome : 0) -
          (Number.isFinite(rawExpense) ? rawExpense : 0),
      };
    },
  );

  // Calculate totals and statistics
  const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = chartData.reduce((sum, item) => sum + item.expense, 0);
  const netTotal = totalIncome - totalExpenses;

  const shownChart = !isLoading && !error && chartData.length > 0;
  const shownPlaceholder = !isLoading && !error && chartData.length === 0;

  return (
    <Card
      className="rounded-2xl border-0 shadow-none"
      title="Income vs Expenses"
      subtitle={
        totalIncome > 0 || totalExpenses > 0
          ? `${formatCurrency(totalIncome, "USD")} in • ${formatCurrency(totalExpenses, "USD")} out`
          : "Track your monthly financial flow"
      }
    >
      {isLoading && <ChartLoading message="Loading financial data..." />}

      {error && (
        <ChartError
          title="Failed to load financial data"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      )}

      {shownChart && (
        <div className="space-y-5">
          <ChartContainer
            config={{
              income: {
                label: "Income",
                color: "var(--primary)",
              },
              expense: {
                label: "Expenses",
                color: "var(--destructive)",
              },
            }}
            className="h-64 w-full sm:h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 10,
                  bottom: 20,
                }}
              >
                <ChartTooltip content={<IncomeExpenseTooltip />} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/30"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground text-xs"
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground text-xs"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--destructive)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--destructive)"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--primary)"
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                  name="Income"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--destructive)"
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                  name="Expenses"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingBottom: "20px",
                    fontSize: "14px",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="bg-muted rounded-xl p-3.5">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
                Income
              </p>
              <p className="text-primary mt-2 text-base font-semibold">
                {formatCurrency(totalIncome, "USD")}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3.5">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
                Expenses
              </p>
              <p className="text-destructive mt-2 text-base font-semibold">
                {formatCurrency(totalExpenses, "USD")}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3.5">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
                Net
              </p>
              <p
                className={`mt-2 text-base font-semibold ${netTotal >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {netTotal >= 0 ? "+" : ""}
                {formatCurrency(netTotal, "USD")}
              </p>
            </div>
          </div>
        </div>
      )}

      {shownPlaceholder && (
        <DataNotFoundPlaceholder>
          No financial data found.
          <br />
          <span className="text-muted-foreground mt-2 block text-xs">
            <DollarSign className="mr-1 inline size-4" />
            Start adding income and expense transactions to see your financial
            flow.
          </span>
        </DataNotFoundPlaceholder>
      )}
    </Card>
  );
}
