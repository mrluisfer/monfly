"use client";

import { useMemo } from "react";
import { hideMetricsAtom } from "@/state";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { ArrowUpRightIcon, TrendingDown, TrendingUp } from "lucide-react";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { cn } from "~/lib/utils";
import { queryKeys } from "~/utils/query-keys";
import { formatCurrency } from "~/utils/format-currency";

import { MetricCard } from "@/components/ui/metric-card";

type ChartPoint = {
  income?: number;
  expense?: number;
  month?: string;
};

function safe(n: unknown) {
  return Number.isFinite(n as number) ? Number(n) : 0;
}

function pctDelta(current: number, previous: number) {
  if (!previous) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function DashboardMetrics({ className }: { className?: string }) {
  const userEmail = useRouteUser();
  const hideMetrics = useAtomValue(hideMetricsAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.charts.incomeExpense(userEmail),
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  const summary = useMemo(() => {
    const points: ChartPoint[] = data?.data ?? [];
    const totalIncome = points.reduce((s, p) => s + safe(p.income), 0);
    const totalExpenses = points.reduce((s, p) => s + safe(p.expense), 0);
    const netTotal = totalIncome - totalExpenses;
    const last = points.at(-1);
    const prev = points.at(-2);
    const incomeDelta =
      last && prev ? pctDelta(safe(last.income), safe(prev.income)) : null;
    const expenseDelta =
      last && prev ? pctDelta(safe(last.expense), safe(prev.expense)) : null;
    const netLast = last ? safe(last.income) - safe(last.expense) : 0;
    const netPrev = prev ? safe(prev.income) - safe(prev.expense) : 0;
    const netDelta = last && prev ? pctDelta(netLast, netPrev) : null;
    const savingsRate =
      totalIncome > 0 ? Math.round((netTotal / totalIncome) * 100) : 0;

    return {
      totalIncome,
      totalExpenses,
      netTotal,
      latestLabel: last?.month ?? "Latest",
      incomeDelta,
      expenseDelta,
      netDelta,
      savingsRate,
    };
  }, [data?.data]);

  if (hideMetrics) return null;

  if (error) {
    return (
      <div className="bg-card text-destructive border-destructive/20 rounded-2xl border p-4 text-sm">
        Failed to load financial metrics.
      </div>
    );
  }

  const trend = (delta: number | null) => {
    if (delta === null || !Number.isFinite(delta)) return undefined;
    const direction =
      Math.abs(delta) < 0.5 ? "flat" : delta > 0 ? "up" : "down";
    return {
      value: `${Math.abs(delta).toFixed(1)}%`,
      direction: direction as "up" | "down" | "flat",
    };
  };

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-1", className)}>
      <MetricCard
        label="Income"
        value={formatCurrency(summary.totalIncome, "USD")}
        icon={<TrendingUp />}
        accent="success"
        trend={trend(summary.incomeDelta)}
        helper={`${summary.latestLabel} vs previous period`}
        loading={isLoading}
      />
      <MetricCard
        label="Expenses"
        value={formatCurrency(summary.totalExpenses, "USD")}
        icon={<TrendingDown />}
        accent="destructive"
        trend={trend(
          summary.expenseDelta === null ? null : -summary.expenseDelta,
        )}
        helper={`${summary.latestLabel} vs previous period`}
        loading={isLoading}
      />
      <MetricCard
        label="Net flow"
        value={`${summary.netTotal >= 0 ? "+" : ""}${formatCurrency(summary.netTotal, "USD")}`}
        icon={<ArrowUpRightIcon />}
        accent={summary.netTotal >= 0 ? "primary" : "destructive"}
        trend={trend(summary.netDelta)}
        helper={`Savings rate ${summary.savingsRate}%`}
        loading={isLoading}
      />
    </div>
  );
}
