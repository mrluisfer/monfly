"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { ArrowUpRightIcon, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { hideMetricsAtom } from "@/state";
import { useActiveCard } from "~/hooks/cards";
import { useCurrency } from "~/hooks/useCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { cn } from "~/lib/utils";
import { queryKeys } from "~/utils/query-keys";

interface ChartPoint {
  expense?: number;
  income?: number;
  month?: string;
}

function safe(n: unknown) {
  return Number.isFinite(n as number) ? Number(n) : 0;
}

function pctDelta(current: number, previous: number) {
  if (!previous) {
    return null;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function DashboardMetrics({ className }: { className?: string }) {
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();
  const { format: formatAmount } = useCurrency();
  const hideMetrics = useAtomValue(hideMetricsAtom);

  const { data, isLoading, error } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 5,
    queryFn: () =>
      getIncomeExpenseDataServer({
        data: { cardId: activeCard, email: userEmail },
      }),
    queryKey: queryKeys.charts.incomeExpense(userEmail, activeCard),
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 3,
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
      expenseDelta,
      incomeDelta,
      latestLabel: last?.month ?? "Latest",
      netDelta,
      netTotal,
      savingsRate,
      totalExpenses,
      totalIncome,
    };
  }, [data?.data]);

  if (hideMetrics) {
    return null;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-4 text-destructive text-sm">
        Failed to load financial metrics.
      </div>
    );
  }

  const trend = (delta: number | null) => {
    if (delta === null || !Number.isFinite(delta)) {
      return;
    }
    let direction: "up" | "down" | "flat" = "flat";
    if (Math.abs(delta) >= 0.5) {
      direction = delta > 0 ? "up" : "down";
    }
    return {
      direction: direction as "up" | "down" | "flat",
      value: `${Math.abs(delta).toFixed(1)}%`,
    };
  };

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-1", className)}>
      <MetricCard
        label="Income"
        value={formatAmount(summary.totalIncome)}
        icon={<TrendingUp />}
        accent="success"
        trend={trend(summary.incomeDelta)}
        helper={`${summary.latestLabel} vs previous period`}
        loading={isLoading}
      />
      <MetricCard
        label="Expenses"
        value={formatAmount(summary.totalExpenses)}
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
        value={`${summary.netTotal >= 0 ? "+" : ""}${formatAmount(summary.netTotal)}`}
        icon={<ArrowUpRightIcon />}
        accent={summary.netTotal >= 0 ? "primary" : "destructive"}
        trend={trend(summary.netDelta)}
        helper={`Savings rate ${summary.savingsRate}%`}
        loading={isLoading}
      />
    </div>
  );
}
