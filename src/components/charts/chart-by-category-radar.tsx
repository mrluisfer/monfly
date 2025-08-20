"use client";

import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import {
  TransactionType,
  transactionTypes,
} from "~/constants/transaction-types";
import { useRouteUser } from "~/hooks/use-route-user";
import { getChartTypeByCategoryServer } from "~/lib/api/chart/get-chart-type-by-category.server";
import { getTrendingMonthlyServer } from "~/lib/api/chart/get-trending-monthly.server";
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

import Card from "../card";
import { TrendingStatus } from "./trending-status";

type ChartByCategoryRadarProps = {
  type: TransactionType; // "income" | "expense"
  small?: boolean;
};

export default function ChartByCategoryRadar({
  type,
  small = false,
}: ChartByCategoryRadarProps) {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["income-expense-by-category", userEmail],
    queryFn: () => getChartTypeByCategoryServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  const { data: trendingMonthlyData } = useQuery({
    queryKey: ["trending-monthly", userEmail, type],
    queryFn: () =>
      getTrendingMonthlyServer({
        data: {
          email: userEmail,
          type,
        },
      }),
    enabled: !!userEmail,
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

  return (
    <Card
      title={`${chartLabel} by Category (Radar)`}
      subtitle={
        small
          ? `Visualize your ${chartLabel.toLowerCase()} distribution across categories`
          : null
      }
      Footer={
        small ? (
          <div className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              <TrendingStatus type={type} data={trendingMonthlyData} />
            </div>
          </div>
        ) : null
      }
    >
      {isLoading && <div className="py-12 text-center">Loading chart...</div>}
      {error && (
        <div className="py-12 text-center text-red-500">Error loading data</div>
      )}
      {shownChart ? (
        <ChartContainer config={chartConfig} className="">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart
              data={chartData}
              margin={{ top: 32, right: 32, bottom: 32, left: 32 }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <Radar
                dataKey={type} // <- "income" o "expense"
                fill={color}
                fillOpacity={0.6}
                stroke="var(--primary)"
                dot={{ r: 4, fillOpacity: 1 }}
                name={chartLabel}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : null}
      {shownPlaceholder ? (
        <DataNotFoundPlaceholder>
          No {chartLabel.toLowerCase()} data for categories
        </DataNotFoundPlaceholder>
      ) : null}
    </Card>
  );
}
