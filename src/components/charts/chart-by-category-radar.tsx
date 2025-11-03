"use client";

import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
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
import { useRouteUser } from "~/hooks/use-route-user";
import { getChartTypeByCategoryServer } from "~/lib/api/chart/get-chart-type-by-category.server";
import { getTrendingMonthlyServer } from "~/lib/api/chart/get-trending-monthly.server";
import { queryDictionary } from "~/queries/dictionary";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TrendingStatus } from "./trending-status";

type ChartByCategoryRadarProps = {
  type: TransactionType; // "income" | "expense"
};

export default function ChartByCategoryRadar({
  type,
}: ChartByCategoryRadarProps) {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    queryKey: [queryDictionary.incomeExpenseByCategory, userEmail],
    queryFn: () => getChartTypeByCategoryServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  const { data: trendingMonthlyData } = useQuery({
    queryKey: [queryDictionary.trendingMonthly, userEmail, type],
    queryFn: () =>
      getTrendingMonthlyServer({
        data: {
          email: userEmail,
          type,
        },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  console.log("Trending Monthly Data:", trendingMonthlyData);

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
    <Card>
      <CardHeader>
        <CardTitle>{`${chartLabel} by Category (Radar)`}</CardTitle>
        <CardDescription>
          Visualize your {chartLabel.toLowerCase()} distribution across
          categories
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading && <div className="py-12 text-center">Loading chart...</div>}
        {error && (
          <div className="py-12 text-center text-red-500">
            Error loading data
          </div>
        )}
        {shownChart && (
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <RadarChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <Radar
                  dataKey={type} // <- "income" o "expense"
                  fill={color}
                  fillOpacity={0.6}
                  stroke="var(--primary)"
                  dot={{ r: 5, fillOpacity: 1 }}
                  strokeWidth={2}
                  name={chartLabel}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
        {shownPlaceholder && (
          <DataNotFoundPlaceholder>
            No {chartLabel.toLowerCase()} data for categories
          </DataNotFoundPlaceholder>
        )}
      </CardContent>

      {stats && (
        <CardFooter>
          <div className="space-y-3 text-sm w-full">
            <div className="flex items-center gap-2 leading-none font-medium">
              <TrendingStatus type={type} data={trendingMonthlyData} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Top Category
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {stats.maxCategory}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Categories</div>
                <div className="font-semibold text-sm">
                  {stats.categoriesCount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Total {chartLabel}
                </div>
                <div className="font-semibold text-sm">
                  ${stats.total.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Average</div>
                <div className="font-semibold text-sm">
                  ${Math.round(stats.avg).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-xs text-muted-foreground mb-2">
                Distribution
              </div>
              <div className="flex gap-1">
                {chartData.map((item, index) => {
                  const percentage =
                    stats.total > 0
                      ? ((item[type] || 0) / stats.total) * 100
                      : 0;
                  return (
                    <div
                      key={index}
                      className="h-2 bg-primary rounded-sm flex-1"
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
