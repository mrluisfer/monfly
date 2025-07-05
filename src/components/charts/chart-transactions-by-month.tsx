import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionsCountByMonthServer } from "~/lib/api/chart/get-transaction-count-by-month.server";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function ChartTransactionsByMonth() {
  const userEmail = useRouteUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions-by-month", userEmail],
    queryFn: () =>
      getTransactionsCountByMonthServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  const chartData = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions by Month</CardTitle>
        <CardDescription>
          See how many transactions you do each month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-12 text-center">Loading chart...</div>}
        {error && (
          <div className="py-12 text-center text-red-500">
            Error loading data
          </div>
        )}
        {!isLoading && !error && chartData.length > 0 && (
          <ChartContainer
            config={{
              count: {
                label: "Transactions",
                color: "var(--chart-1)",
              },
            }}
            className="mx-auto w-full max-w-2xl"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  content={<ChartTooltipContent indicator="dot" />}
                  cursor={{ fill: "var(--muted)", fillOpacity: 0.15 }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
        {!isLoading && !error && chartData.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No transaction data found for the user
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center gap-2 text-sm">
          <span className="flex items-center gap-1 font-medium">
            Trending up by 12% this year <TrendingUp className="h-4 w-4" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
