"use client";

import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  TransactionType,
  transactionTypes,
} from "~/constants/transaction-types";
import { useActiveCard } from "~/hooks/cards";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getChartTypeByCategoryServer } from "~/lib/api/chart/get-chart-type-by-category";
import { getTrendingMonthlyServer } from "~/lib/api/chart/get-trending-monthly";
import { queryKeys } from "~/utils/query-keys";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TrendingStatus } from "./TrendingStatus";

type ChartByCategoryRadarProps = {
  type: TransactionType; // "income" | "expense"
};

export default function ChartByCategoryRadar({
  type,
}: ChartByCategoryRadarProps) {
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.charts.byCategory(userEmail, activeCard),
    queryFn: () =>
      getChartTypeByCategoryServer({
        data: { email: userEmail, cardId: activeCard },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  const { data: trendingMonthlyData } = useQuery({
    queryKey: queryKeys.charts.trending(userEmail, type, activeCard),
    queryFn: () =>
      getTrendingMonthlyServer({
        data: {
          email: userEmail,
          type,
          cardId: activeCard,
        },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  // [{ category: string, income: number, expense: number }]
  const chartData = data?.data ?? [];
  const isIncome = type === transactionTypes.INCOME;

  const chartLabel = isIncome ? "Income" : "Expense";
  const color = isIncome ? "var(--chart-1)" : "var(--chart-3)";

  const chartConfig = {
    [type]: {
      label: chartLabel,
      color,
    },
  } satisfies ChartConfig;

  const shownChart = !isLoading && !error && chartData.length;
  const shownPlaceholder = !isLoading && !error && chartData.length === 0;

  // Calculate interesting statistics from the data
  const calculateStats = () => {
    if (!chartData.length) return null;

    const values = chartData.map((item) => item[type] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const max = Math.max(...values);
    const maxCategory =
      chartData.find((item) => item[type] === max)?.category || "";
    const avg = total / values.length;
    const categoriesCount = chartData.length;

    return { total, max, maxCategory, avg, categoriesCount };
  };

  const stats = calculateStats();

  return (
    <Card className="rounded-2xl border-0 shadow-none">
      <CardHeader>
        <CardTitle>{`${chartLabel} by Category`}</CardTitle>
        <CardDescription>
          Visualize your {chartLabel.toLowerCase()} distribution across
          categories
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading && <div className="py-12 text-center">Loading chart...</div>}
        {error && (
          <div className="text-destructive py-12 text-center">
            Error loading data
          </div>
        )}
        {shownChart && (
          <ChartContainer config={chartConfig} className="h-full min-h-[250px]">
            <RadarChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <Radar
                // Use the function form of `dataKey`: passing the nominal
                // `transactionTypes` enum value confuses recharts' generic
                // inference (it builds a bogus "INCOME" | "EXPENSE" key union
                // from the enum member names). Reading the field ourselves keeps
                // it type-safe and avoids that.
                dataKey={(entry: Record<TransactionType, number>) => entry[type]}
                fill={color}
                fillOpacity={0.6}
                stroke="var(--primary)"
                dot={{ r: 5, fillOpacity: 1 }}
                strokeWidth={2}
                name={chartLabel}
              />
            </RadarChart>
          </ChartContainer>
        )}
        {shownPlaceholder && (
          <DataNotFoundPlaceholder>
            No {chartLabel.toLowerCase()} data for categories
          </DataNotFoundPlaceholder>
        )}
      </CardContent>

      {stats && (
        <CardFooter className="bg-transparent">
          <div className="w-full space-y-3 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              <TrendingStatus type={type} data={trendingMonthlyData} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted space-y-1 rounded-xl p-3">
                <div className="text-muted-foreground text-xs">
                  Top Category
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {stats.maxCategory}
                </Badge>
              </div>
              <div className="bg-muted space-y-1 rounded-xl p-3">
                <div className="text-muted-foreground text-xs">Categories</div>
                <div className="text-sm font-semibold">
                  {stats.categoriesCount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted space-y-1 rounded-xl p-3">
                <div className="text-muted-foreground text-xs">
                  Total {chartLabel}
                </div>
                <div className="text-sm font-semibold">
                  ${stats.total.toLocaleString()}
                </div>
              </div>
              <div className="bg-muted space-y-1 rounded-xl p-3">
                <div className="text-muted-foreground text-xs">Average</div>
                <div className="text-sm font-semibold">
                  ${Math.round(stats.avg).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-muted-foreground mb-2 text-xs">
                Distribution
              </div>
              <div className="flex gap-1">
                {chartData.map((item) => {
                  const percentage =
                    stats.total > 0
                      ? ((item[type] || 0) / stats.total) * 100
                      : 0;
                  return (
                    <div
                      key={item.category}
                      className="bg-primary h-2 flex-1 rounded-sm"
                      style={{
                        opacity: Math.max(0.2, percentage / 100),
                        minWidth: "2px",
                      }}
                      title={`${item.category}: ${percentage.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
