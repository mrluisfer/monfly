import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useRouteUser } from "~/hooks/useRouteUser";
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
import { ChartError, ChartLoading } from "./ChartLoading";

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
    <div className="bg-background/95 border-border rounded-lg border p-3 shadow-lg backdrop-blur-sm">
      <p className="text-foreground font-semibold">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <Activity className="text-primary size-5" />
        <span className="text-muted-foreground text-sm">Transactions:</span>
        <span className="text-foreground font-bold">{value}</span>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
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
    .map((item: { month?: unknown; count?: unknown }) => {
      const count = Number(item.count);
      return {
        month: String(item.month || "Unknown"),
        count: Number.isFinite(count) ? Math.max(0, count) : 0,
      };
    })
    .filter((item) => item.count > 0);

  const totalTransactions = chartData.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const averagePerMonth =
    chartData.length > 0 ? Math.round(totalTransactions / chartData.length) : 0;

  // Calculate additional statistics
  const maxCount = Math.max(...chartData.map((item) => item.count));
  const minCount = Math.min(...chartData.map((item) => item.count));
  const maxMonth =
    chartData.find((item) => item.count === maxCount)?.month || "";
  const minMonth =
    chartData.find((item) => item.count === minCount)?.month || "";

  // Calculate trend (simple comparison of last 2 months if available)
  const trendPercentage =
    chartData.length >= 2 && chartData[chartData.length - 2]?.count > 0
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
    <Card className="h-fit w-full max-w-5xl rounded-2xl border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <BarChart3Icon className="text-primary size-5" />
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
              className="h-60 w-full min-w-0 sm:h-70 md:h-80"
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
                  className="fill-muted-foreground text-xs"
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
                  className="fill-muted-foreground text-xs"
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
            <div className="w-full min-w-0 space-y-3 text-sm">
              {/* Trend Information */}
              {chartData.length >= 2 && (
                <>
                  <div className="bg-muted flex flex-wrap items-center gap-2 rounded-xl p-3.5">
                    {isPositiveTrend ? (
                      <TrendingUpIcon className="text-primary size-4" />
                    ) : (
                      <TrendingDownIcon className="text-destructive size-4" />
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
                <div className="bg-muted space-y-2 rounded-xl p-3.5">
                  <div className="flex items-center gap-2">
                    <ArrowUpIcon className="text-primary size-5" />
                    <div>
                      <div className="text-muted-foreground text-xs">
                        Peak Month
                      </div>
                      <div className="font-semibold">{maxMonth}</div>
                      <div className="text-muted-foreground text-xs">
                        {maxCount} transactions
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted space-y-2 rounded-xl p-3.5">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="text-primary size-5" />
                    <div>
                      <div className="text-muted-foreground text-xs">
                        Data Period
                      </div>
                      <div className="font-semibold">
                        {monthsWithData} months
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Average: {averagePerMonth}/month
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Distribution Bar */}
              <div className="bg-muted space-y-2 rounded-xl p-3.5">
                <div className="text-muted-foreground text-xs">
                  Monthly Distribution
                </div>
                <div className="flex h-2 gap-1">
                  {chartData.map((item) => {
                    const percentage =
                      totalTransactions > 0
                        ? (item.count / totalTransactions) * 100
                        : 0;
                    return (
                      <div
                        key={item.month}
                        className="bg-primary flex-1 rounded-sm transition-opacity hover:opacity-80"
                        style={{
                          opacity: Math.max(0.3, percentage / 100),
                          minWidth: "4px",
                        }}
                        title={`${item.month}: ${item.count} transactions (${percentage.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="text-muted-foreground flex justify-between gap-2 text-xs">
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
            <span className="text-muted-foreground mt-2 block text-xs">
              <Calendar className="mr-1 inline size-4" />
              Start making transactions to see your monthly activity.
            </span>
          </DataNotFoundPlaceholder>
        )}
      </CardContent>
    </Card>
  );
}
