import { useQuery } from "@tanstack/react-query";
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
import { queryKeys } from "~/utils/query-keys";

import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ChartError, ChartLoading } from "./ChartLoading";

interface MonthlyActivityTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ value?: number }>;
  totalTransactions: number;
}

function MonthlyActivityTooltip({
  active,
  payload,
  label,
  totalTransactions,
}: MonthlyActivityTooltipProps) {
  if (!(active && payload?.length)) {
    return null;
  }

  const value = payload[0]?.value ?? 0;
  const percentage =
    totalTransactions > 0
      ? ((value / totalTransactions) * 100).toFixed(1)
      : "0";

  return (
    <div className="rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <Activity className="size-5 text-primary" />
        <span className="text-muted-foreground text-sm">Transactions:</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <p className="mt-1 text-muted-foreground text-xs">
        {percentage}% of total activity
      </p>
    </div>
  );
}

export default function ChartTransactionsByMonth() {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    queryFn: () =>
      getTransactionsCountByMonthServer({ data: { email: userEmail } }),
    queryKey: queryKeys.charts.byMonth(userEmail),
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });

  // Process and validate chart data
  const rawChartData = data?.data ?? [];
  const chartData = rawChartData
    .map((item: { month?: unknown; count?: unknown }) => {
      const count = Number(item.count);
      return {
        count: Number.isFinite(count) ? Math.max(0, count) : 0,
        month: String(item.month || "Unknown"),
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
  const latest = chartData.at(-1);
  const previous = chartData.at(-2);
  const trendPercentage =
    latest && previous && previous.count > 0
      ? ((latest.count - previous.count) / previous.count) * 100
      : 0;

  const isPositiveTrend = trendPercentage >= 0;
  const monthsWithData = chartData.length;

  const shownChart = !(isLoading || error) && chartData.length > 0;
  const shownPlaceholder = !(isLoading || error) && chartData.length === 0;

  return (
    <Card className="h-fit w-full max-w-5xl border-0 shadow-none">
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
        {isLoading ? (
          <ChartLoading message="Loading transaction activity..." />
        ) : null}

        {error ? (
          <ChartError
            title="Failed to load transaction data"
            message={error.message}
            onRetry={() => window.location.reload()}
          />
        ) : null}

        {shownChart ? (
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <ChartContainer
              config={{
                count: {
                  color: "hsl(221, 83%, 53%)", // Blue
                  label: "Transactions",
                },
              }}
              className="h-60 w-full min-w-0 sm:h-70 md:h-80"
            >
              <BarChart
                data={chartData}
                margin={{
                  bottom: 20,
                  left: 10,
                  right: 10,
                  top: 20,
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
                  tickFormatter={(value) => value}
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
                  fill="var(--chart-1)"
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
                  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-muted p-3.5">
                    {isPositiveTrend ? (
                      <TrendingUpIcon className="size-4 text-primary" />
                    ) : (
                      <TrendingDownIcon className="size-4 text-destructive" />
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
                <div className="space-y-2 rounded-xl bg-muted p-3.5">
                  <div className="flex items-center gap-2">
                    <ArrowUpIcon className="size-5 text-primary" />
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

                <div className="space-y-2 rounded-xl bg-muted p-3.5">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="size-5 text-primary" />
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
              <div className="space-y-2 rounded-xl bg-muted p-3.5">
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
                        className="flex-1 rounded-sm bg-chart-1 transition-opacity hover:opacity-80"
                        style={{
                          minWidth: "4px",
                          opacity: Math.max(0.3, percentage / 100),
                        }}
                        title={`${item.month}: ${item.count} transactions (${percentage.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between gap-2 text-muted-foreground text-xs">
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
        ) : null}

        {shownPlaceholder ? (
          <DataNotFoundPlaceholder>
            No transaction data found.
            <br />
            <span className="mt-2 block text-muted-foreground text-xs">
              <Calendar className="mr-1 inline size-4" />
              Start making transactions to see your monthly activity.
            </span>
          </DataNotFoundPlaceholder>
        ) : null}
      </CardContent>
    </Card>
  );
}
