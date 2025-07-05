"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart.server";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../card";

export default function IncomeExpenseChart() {
  const userEmail = useRouteUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["income-expense-data", userEmail],
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  const chartData = data?.data ?? [];

  return (
    <Card title="Income & Expenses" subtitle="Per month">
      {isLoading && <div className="py-12 text-center">Loading chart...</div>}
      {error && (
        <div className="py-12 text-center text-red-500">Error loading data</div>
      )}
      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              name="Income"
              fillOpacity={0.25}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              name="Expense"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
