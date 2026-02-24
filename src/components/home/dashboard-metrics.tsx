"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardMetrics({ className }: { className?: string }) {
  const userEmail = useRouteUser();

  const { data, isLoading, error } = useQuery({
    queryKey: [queryDictionary.incomeExpenseData, userEmail],
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  // Process data
  const rawChartData = data?.data ?? [];
  const totalIncome = rawChartData.reduce(
    (sum: number, item: any) =>
      sum + (Number.isFinite(item.income) ? item.income : 0),
    0
  );
  const totalExpenses = rawChartData.reduce(
    (sum: number, item: any) =>
      sum + (Number.isFinite(item.expense) ? item.expense : 0),
    0
  );
  const netTotal = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <div
        className={cn("grid gap-4 md:grid-cols-3 xl:grid-cols-1", className)}
      >
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        Failed to load financial metrics
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-3 xl:grid-cols-1", className)}>
      <Card className="bg-linear-to-br from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent border-green-200/50 dark:border-green-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">Total recorded income</p>
        </CardContent>
      </Card>
      <Card className="bg-linear-to-br from-red-50 to-transparent dark:from-red-950/20 dark:to-transparent border-red-200/50 dark:border-red-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">
            Total recorded expenses
          </p>
        </CardContent>
      </Card>
      <Card className="bg-linear-to-br from-background to-accent/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
          <div className="p-2 bg-secondary rounded-full">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              netTotal >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netTotal >= 0 ? "+" : ""}
            {formatCurrency(netTotal, "USD")}
          </div>
          <p className="text-xs text-muted-foreground">Income minus expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}
