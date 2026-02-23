"use client";

import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import { useRouteUser } from "~/hooks/use-route-user";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart.server";
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

import Card from "../card";
import { ChartError, ChartLoading } from "./chart-loading";

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
  const chartData = rawChartData.map((item: any) => ({
    month: String(item.month || "Unknown"),
    income: Number.isFinite(item.income) ? Math.max(0, item.income) : 0,
    expense: Number.isFinite(item.expense) ? Math.max(0, item.expense) : 0,
    net:
      (Number.isFinite(item.income) ? item.income : 0) -
      (Number.isFinite(item.expense) ? item.expense : 0),
  }));

  // Calculate totals and statistics
  const totalIncome = chartData.reduce(
    (sum: number, item: any) => sum + item.income,
    0
  );
  const totalExpenses = chartData.reduce(
    (sum: number, item: any) => sum + item.expense,
    0
  );
  const netTotal = totalIncome - totalExpenses;

  const shownChart = !isLoading && !error && chartData.length > 0;
  const shownPlaceholder = !isLoading && !error && chartData.length === 0;

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income =
        payload.find((p: any) => p.dataKey === "income")?.value || 0;
      const expense =
        payload.find((p: any) => p.dataKey === "expense")?.value || 0;
      const net = income - expense;

      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg min-w-[200px]">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "hsl(134, 61%, 41%)" }}
                />
                <span className="text-sm text-muted-foreground">Income:</span>
              </div>
              <span
                className="font-semibold"
                style={{ color: "hsl(134, 61%, 41%)" }}
              >
                {formatCurrency(income, "USD")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "hsl(0, 65%, 51%)" }}
                />
                <span className="text-sm text-muted-foreground">Expenses:</span>
              </div>
              <span
                className="font-semibold"
                style={{ color: "hsl(0, 65%, 51%)" }}
              >
                {formatCurrency(expense, "USD")}
              </span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Net:
                </span>
                <span
                  className="font-bold"
                  style={{
                    color: net >= 0 ? "hsl(134, 61%, 41%)" : "hsl(0, 65%, 51%)",
                  }}
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
    return null;
  };

  return (
    <Card
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
        <div className="space-y-4">
          {/* Chart */}
          <ChartContainer
            config={{
              income: {
                label: "Income",
                color: "hsl(134, 61%, 41%)",
              },
              expense: {
                label: "Expenses",
                color: "hsl(0, 65%, 51%)",
              },
            }}
            className="w-full h-64 sm:h-80"
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
                <ChartTooltip content={<CustomTooltip />} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/30"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-muted-foreground"
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
                      stopColor="hsl(134, 61%, 41%)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(134, 61%, 41%)"
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
                      stopColor="hsl(0, 65%, 51%)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(0, 65%, 51%)"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(134, 61%, 41%)"
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                  name="Income"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="hsl(0, 65%, 51%)"
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
        </div>
      )}

      {shownPlaceholder && (
        <DataNotFoundPlaceholder>
          No financial data found.
          <br />
          <span className="text-xs text-muted-foreground mt-2 block">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Start adding income and expense transactions to see your financial
            flow.
          </span>
        </DataNotFoundPlaceholder>
      )}
    </Card>
  );
}
