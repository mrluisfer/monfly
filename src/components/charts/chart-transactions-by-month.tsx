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
import { getTransactionsCountByMonthServer } from "~/lib/api/chart/get-transaction-count-by-month";
import { queryDictionary } from "~/queries/dictionary";
import {
  Activity,
  ArrowUpIcon,
  BarChart3Icon,
  Calendar,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ChartError, ChartLoading } from "./chart-loading";

type MonthlyActivityTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
  totalTransactions: number;
};

function MonthlyActivityTooltip({
  active,
  payload,
  label,
  totalTransactions,
}: MonthlyActivityTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value ?? 0;
  const percentage =
    totalTransactions > 0
      ? ((value / totalTransactions) * 100).toFixed(1)
      : "0";

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <Activity className="size-5 text-primary" />
        <span className="text-sm text-muted-foreground">Transactions:</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {percentage}% of total activity
      </p>
    </div>
  );
}

export default function ChartTransactionsByMonth() {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    queryKey: [queryDictionary.transactionsByMonth, userEmail],
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

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <BarChart3Icon className="size-5 text-primary" />
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
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <ChartContainer
              config={{
                count: {
                  label: "Transactions",
                  color: "hsl(221, 83%, 53%)", // Blue
                },
              }}
              className="min-w-0 w-full h-60 sm:h-70 md:h-80"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 10,
                  bottom: 20,
                }}
              >
                <ChartTooltip
                  content={
                    <MonthlyActivityTooltip
                      totalTransactions={totalTransactions}
                    />
                  }
                />
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
                  minTickGap={14}
                  interval="preserveStartEnd"
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
                  width={36}
                />
                <Bar
                  dataKey="count"
                  fill="var(--primary)"
                  name="Transactions"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ChartContainer>
            <div className="min-w-0 w-full space-y-3 text-sm">
              {/* Trend Information */}
              {chartData.length >= 2 && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpIcon className="size-5 text-green-600 dark:text-green-400" />
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
                    <TargetIcon className="size-5 text-primary" />
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
                  {chartData.map((item: any) => {
                    const percentage =
                      totalTransactions > 0
                        ? (item.count / totalTransactions) * 100
                        : 0;
                    return (
                      <div
                        key={item.month}
                        className="bg-primary rounded-sm flex-1 transition-opacity hover:opacity-80"
                        style={{
                          opacity: Math.max(0.3, percentage / 100),
                          minWidth: "4px",
                        }}
                        title={`${item.month}: ${item.count} transactions (${percentage.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                  <span className="truncate">
                    {minMonth} ({minCount})
                  </span>
                  <span className="truncate text-right">
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
