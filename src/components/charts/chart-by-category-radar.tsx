"use client";

import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import {
  TransactionType,
  transactionTypes,
} from "~/constants/transaction-types";
import { useRouteUser } from "~/hooks/use-route-user";
import { getChartTypeByCategoryServer } from "~/lib/api/chart/get-chart-type-by-category.server";
import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartByCategoryRadarProps = {
  type: TransactionType; // "income" | "expense"
};

export default function ChartByCategoryRadar({
  type,
}: ChartByCategoryRadarProps) {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["income-expense-by-category", userEmail],
    queryFn: () => getChartTypeByCategoryServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
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

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{chartLabel} by Category (Radar)</CardTitle>
        <CardDescription>
          {isIncome
            ? "Visualize your income distribution across categories."
            : "Visualize your expense distribution across categories."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {isLoading && <div className="py-12 text-center">Loading chart...</div>}
        {error && (
          <div className="py-12 text-center text-red-500">
            Error loading data
          </div>
        )}
        {shownChart ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart
                data={chartData}
                margin={{ top: 32, right: 32, bottom: 32, left: 32 }}
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          This year
        </div>
      </CardFooter>
    </Card>
  );
}
