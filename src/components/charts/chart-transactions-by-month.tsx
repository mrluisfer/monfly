import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionsCountByMonthServer } from "~/lib/api/chart/get-transaction-count-by-month.server";
import { Activity, Calendar, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import Card from "../card";
import { ChartError, ChartLoading } from "./chart-loading";

export default function ChartTransactionsByMonth({
  small = false,
}: {
  small?: boolean;
}) {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions-by-month", userEmail],
    queryFn: () =>
      getTransactionsCountByMonthServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  // Process and validate chart data
  const rawChartData = data?.data ?? [];
  const chartData = rawChartData
    .map((item: any) => ({
      month: String(item.month || "Unknown"),
      count: Number.isFinite(item.count) ? Math.max(0, item.count) : 0,
    }))
    .filter((item: any) => item.count > 0);

  const totalTransactions = chartData.reduce(
    (sum: number, item: any) => sum + item.count,
    0
  );
  const averagePerMonth =
    chartData.length > 0 ? Math.round(totalTransactions / chartData.length) : 0;
  const maxTransactions = Math.max(
    ...chartData.map((item: any) => item.count),
    0
  );

  // Calculate trend (simple comparison of last 2 months if available)
  const trendPercentage =
    chartData.length >= 2
      ? ((chartData[chartData.length - 1]?.count -
          chartData[chartData.length - 2]?.count) /
          chartData[chartData.length - 2]?.count) *
        100
      : 0;

  const shownChart = !isLoading && !error && chartData.length > 0;
  const shownPlaceholder = !isLoading && !error && chartData.length === 0;

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage =
        totalTransactions > 0
          ? ((value / totalTransactions) * 100).toFixed(1)
          : "0";

      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-muted-foreground">Transactions:</span>
            <span className="font-bold text-foreground">{value}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {percentage}% of total activity
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Monthly Activity"
      subtitle={
        totalTransactions > 0
          ? `${totalTransactions} transactions • ${averagePerMonth}/month avg`
          : "Track your transaction activity over time"
      }
      Footer={
        small && chartData.length >= 2 ? (
          <div className="flex w-full items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-medium text-muted-foreground">
              <TrendingUp
                className={`h-4 w-4 ${trendPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              />
              {trendPercentage >= 0 ? "+" : ""}
              {trendPercentage.toFixed(1)}% vs last month
            </span>
          </div>
        ) : null
      }
    >
      {isLoading && <ChartLoading message="Loading transaction activity..." />}

      {error && (
        <ChartError
          title="Failed to load transaction data"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      )}

      {shownChart && (
        <ChartContainer
          config={{
            count: {
              label: "Transactions",
              color: "hsl(221, 83%, 53%)", // Blue
            },
          }}
          className="w-full h-[280px] sm:h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: small ? 10 : 20,
                left: small ? 10 : 20,
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
                tickMargin={8}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: small ? 10 : 12 }}
                tickFormatter={(value) => (small ? value.slice(0, 3) : value)}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 10 }}
                width={small ? 30 : 40}
              />
              <Bar
                dataKey="count"
                fill="hsl(221, 83%, 53%)"
                name="Transactions"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {shownPlaceholder && (
        <DataNotFoundPlaceholder>
          No transaction data found.
          <br />
          <span className="text-xs text-muted-foreground mt-2 block">
            <Calendar className="w-4 h-4 inline mr-1" />
            Start making transactions to see your monthly activity.
          </span>
        </DataNotFoundPlaceholder>
      )}
    </Card>
  );
}
