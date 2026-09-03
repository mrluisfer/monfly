"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { useActiveCard } from "~/hooks/cards";
import { useCurrency } from "~/hooks/useCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getCurrencySymbol } from "~/utils/format-currency";
import { queryKeys } from "~/utils/query-keys";

import Card from "../shared/Card";
import { MetricsGrid } from "../shared/MetricsGrid";
import { MetricTile } from "../shared/MetricTile";
import { ChartError, ChartLoading } from "./ChartLoading";

interface IncomeExpenseTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ dataKey?: string; value?: number }>;
}

function IncomeExpenseTooltip({
  active,
  payload,
  label,
}: IncomeExpenseTooltipProps) {
  const { formatPlain } = useCurrency();

  if (!(active && payload?.length)) {
    return null;
  }

  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
  const net = income - expense;

  return (
    <div className="min-w-[200px] rounded-lg border border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm">
      <p className="mb-2 font-semibold text-foreground">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-chart-1" />
            <span className="text-muted-foreground text-sm">Income:</span>
          </div>
          <span className="font-semibold text-chart-1">
            {formatPlain(income)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground text-sm">Expenses:</span>
          </div>
          <span className="font-semibold text-destructive">
            {formatPlain(expense)}
          </span>
        </div>
        <div className="border-border border-t pt-2">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-muted-foreground text-sm">
              Net:
            </span>
            <span
              className={`font-bold ${net >= 0 ? "text-chart-1" : "text-destructive"}`}
            >
              {net >= 0 ? "+" : ""}
              {formatPlain(net)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IncomeExpenseChart() {
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();
  const { currency, formatPlain } = useCurrency();

  const { data, isLoading, error } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    queryFn: () =>
      getIncomeExpenseDataServer({
        data: { cardId: activeCard, email: userEmail },
      }),
    queryKey: queryKeys.charts.incomeExpense(userEmail, activeCard),
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
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
        expense,
        income,
        month: String(item.month || "Unknown"),
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

  const shownChart = !(isLoading || error) && chartData.length > 0;
  const shownPlaceholder = !(isLoading || error) && chartData.length === 0;

  return (
    <Card
      className="border-0 shadow-none"
      title="Income vs Expenses"
      subtitle={
        totalIncome > 0 || totalExpenses > 0
          ? `${formatPlain(totalIncome)} in • ${formatPlain(totalExpenses)} out`
          : "Track your monthly financial flow"
      }
    >
      {isLoading ? <ChartLoading message="Loading financial data..." /> : null}

      {error ? (
        <ChartError
          title="Failed to load financial data"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      ) : null}

      {shownChart ? (
        <div className="space-y-5">
          <ChartContainer
            config={{
              expense: {
                color: "var(--destructive)",
                label: "Expenses",
              },
              income: {
                color: "var(--chart-1)",
                label: "Income",
              },
            }}
            className="h-64 w-full sm:h-80"
          >
            <AreaChart
              data={chartData}
              margin={{
                bottom: 20,
                left: 10,
                right: 10,
                top: 20,
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
                tickFormatter={(value) =>
                  `${getCurrencySymbol(currency)}${(value / 1000).toFixed(0)}k`
                }
              />
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
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
                stroke="var(--chart-1)"
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
                  fontSize: "14px",
                  paddingBottom: "20px",
                }}
              />
            </AreaChart>
          </ChartContainer>

          <MetricsGrid>
            <MetricTile
              label="Income"
              value={formatPlain(totalIncome)}
              valueTone="primary"
            />
            <MetricTile
              label="Expenses"
              value={formatPlain(totalExpenses)}
              valueTone="destructive"
            />
            <MetricTile
              label="Net"
              value={`${netTotal >= 0 ? "+" : ""}${formatPlain(netTotal)}`}
              valueTone={netTotal >= 0 ? "primary" : "destructive"}
            />
          </MetricsGrid>
        </div>
      ) : null}

      {shownPlaceholder ? (
        <DataNotFoundPlaceholder>
          No financial data found.
          <br />
          <span className="mt-2 block text-muted-foreground text-xs">
            <DollarSign className="mr-1 inline size-4" />
            Start adding income and expense transactions to see your financial
            flow.
          </span>
        </DataNotFoundPlaceholder>
      ) : null}
    </Card>
  );
}
