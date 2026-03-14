"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { ArrowUpRightIcon, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type MetricCardProps = {
  label: string;
  meta: string;
  toneClassName: string;
  value: string;
  icon: React.ReactNode;
};

function MetricCard({
  icon,
  label,
  meta,
  toneClassName,
  value,
}: MetricCardProps) {
  return (
    <Card className="finance-panel rounded-[1.35rem] border-0 p-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={cn("mt-2 text-2xl font-semibold tracking-tight", toneClassName)}>
              {value}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{meta}</p>
          </div>
          <div className="finance-chip rounded-full p-2.5">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

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

  const summary = useMemo(() => {
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
    const latestPoint = rawChartData.at(-1);
    const latestNet =
      (Number.isFinite(latestPoint?.income) ? latestPoint.income : 0) -
      (Number.isFinite(latestPoint?.expense) ? latestPoint.expense : 0);
    const savingsRate =
      totalIncome > 0 ? Math.round((netTotal / totalIncome) * 100) : 0;

    return {
      latestLabel: latestPoint?.month ? String(latestPoint.month) : "Latest",
      latestNet,
      netTotal,
      savingsRate,
      totalExpenses,
      totalIncome,
    };
  }, [data?.data]);

  if (isLoading) {
    return (
      <div className={cn("grid gap-3 md:grid-cols-3 xl:grid-cols-1", className)}>
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            className="h-32 rounded-[1.35rem] border border-border/70"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-panel rounded-[1.35rem] p-4 text-sm text-destructive">
        Failed to load financial metrics.
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 md:grid-cols-3 xl:grid-cols-1", className)}>
      <MetricCard
        label="Income"
        value={formatCurrency(summary.totalIncome, "USD")}
        meta="Total recorded inflow"
        toneClassName="text-emerald-600 dark:text-emerald-400"
        icon={<TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />}
      />
      <MetricCard
        label="Expenses"
        value={formatCurrency(summary.totalExpenses, "USD")}
        meta="Total recorded outflow"
        toneClassName="text-rose-600 dark:text-rose-400"
        icon={<TrendingDown className="size-4 text-rose-600 dark:text-rose-400" />}
      />
      <MetricCard
        label="Net flow"
        value={`${summary.netTotal >= 0 ? "+" : ""}${formatCurrency(summary.netTotal, "USD")}`}
        meta={`${summary.latestLabel}: ${formatCurrency(summary.latestNet, "USD")} • ${summary.savingsRate}% savings rate`}
        toneClassName={
          summary.netTotal >= 0
            ? "text-primary"
            : "text-amber-700 dark:text-amber-300"
        }
        icon={<ArrowUpRightIcon className="size-4 text-primary" />}
      />
    </div>
  );
}
