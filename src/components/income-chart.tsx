"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { getMonthlySummaryByEmailServer } from "~/lib/api/monthly-summary/get-monthly-summary-by-email.server";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import Card from "./card";

export const description = "A linear area chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function IncomeChart() {
  const userEmail = useRouteUser();
  const emailRef = useRef(userEmail);

  const putUserTotalBalanceMutation = useMutation({
    fn: getMonthlySummaryByEmailServer,
    onSuccess: async (ctx) => {
      if (ctx.data?.error) {
        console.log(ctx.data);
      }
      console.log(ctx.data);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!emailRef.current) return;
    putUserTotalBalanceMutation.mutate({
      data: { email: emailRef.current },
    });
  }, []);

  return (
    <Card
      title={<div>Income Chart</div>}
      subtitle="Showing total income for the last 6 months"
      Footer={
        <div className="flex w-full items-start gap-4 text-sm">
          <div className="grid gap-4">
            <div className="flex items-center gap-4 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-4 leading-none">
              January - June {new Date().getFullYear()}
            </div>
          </div>
        </div>
      }
    >
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel />}
          />
          <Area
            dataKey="desktop"
            type="linear"
            fill="var(--primary)"
            fillOpacity={0.4}
            stroke="var(--primary)"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}

export default IncomeChart;
