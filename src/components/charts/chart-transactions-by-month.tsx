import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionsCountByMonthServer } from "~/lib/api/chart/get-transaction-count-by-month.server";
import {
  Activity,
  ArrowUpIcon,
  BarChart3,
  Calendar,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ChartError, ChartLoading } from "./chart-loading";

export default function ChartTransactionsByMonth() {
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

  // Calculate additional statistics
  const maxCount = Math.max(...chartData.map((item: any) => item.count));
  const minCount = Math.min(...chartData.map((item: any) => item.count));
  const maxMonth =
    chartData.find((item: any) => item.count === maxCount)?.month || "";
  const minMonth =
    chartData.find((item: any) => item.count === minCount)?.month || "";

  // Calculate trend (simple comparison of last 2 months if available)
  const trendPercentage =
    chartData.length >= 2
      ? ((chartData[chartData.length - 1]?.count -
          chartData[chartData.length - 2]?.count) /
          chartData[chartData.length - 2]?.count) *
        100
      : 0;

  const isPositiveTrend = trendPercentage >= 0;
  const monthsWithData = chartData.length;

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
    <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Monthly Activity
        </CardTitle>
        <CardDescription>
          {totalTransactions > 0
            ? `${totalTransactions} transactions • ${averagePerMonth}/month avg`
            : "Track your transaction activity over time"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <ChartLoading message="Loading transaction activity..." />
        )}

        {error && (
          <ChartError
            title="Failed to load transaction data"
            message={error.message}
            onRetry={() => window.location.reload()}
          />
        )}

        {shownChart && (
          <div className="flex gap-6">
            <ChartContainer
              config={{
                count: {
                  label: "Transactions",
                  color: "hsl(221, 83%, 53%)", // Blue
                },
              }}
              className="w-full h-[280px] sm:h-80"
            >
              <ResponsiveContainer width="500px" height="100%">
                <BarChart
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
                    tickMargin={8}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      return value;
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 10 }}
                    width={40}
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
            <div className="space-y-3 text-sm w-full">
              {/* Trend Information */}
              {chartData.length >= 2 && (
                <>
                  <div className="flex items-center gap-2">
                    {isPositiveTrend ? (
                      <TrendingUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="font-medium">
                      {isPositiveTrend ? "+" : ""}
                      {trendPercentage.toFixed(1)}% vs last month
                    </span>
                    <Badge
                      variant={isPositiveTrend ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {isPositiveTrend ? "Growing" : "Declining"}
                    </Badge>
                  </div>
                  <Separator />
                </>
              )}

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Peak Month
                      </div>
                      <div className="font-semibold">{maxMonth}</div>
                      <div className="text-xs text-muted-foreground">
                        {maxCount} transactions
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Data Period
                      </div>
                      <div className="font-semibold">
                        {monthsWithData} months
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Average: {averagePerMonth}/month
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Distribution Bar */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Monthly Distribution
                </div>
                <div className="flex gap-1 h-2">
                  {chartData.map((item: any, index: number) => {
                    const percentage =
                      totalTransactions > 0
                        ? (item.count / totalTransactions) * 100
                        : 0;
                    return (
                      <div
                        key={index}
                        className="bg-blue-600 dark:bg-blue-400 rounded-sm flex-1 transition-opacity hover:opacity-80"
                        style={{
                          opacity: Math.max(0.3, percentage / 100),
                          minWidth: "4px",
                        }}
                        title={`${item.month}: ${item.count} transactions (${percentage.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {minMonth} ({minCount})
                  </span>
                  <span>
                    {maxMonth} ({maxCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
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
      </CardContent>
    </Card>
  );
}
