import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";

export type ChartData = Record<string, unknown>;

export interface ChartQueryResponse {
  data?: ChartData[] | null;
}

export interface ChartHookOptions {
  enabled?: boolean;
  queryFn: () => Promise<ChartQueryResponse>;
  queryKey: string[];
}

export interface ChartHookResult {
  data: ChartData[];
  error: Error | null;
  hasData: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export function useChart({
  queryKey,
  queryFn,
  enabled = true,
}: ChartHookOptions): ChartHookResult {
  const userEmail = useRouteUser();

  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    enabled: enabled && !!userEmail,
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    queryFn,
    queryKey: [...queryKey, userEmail],
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });

  // Process and sanitize data
  const data = rawData?.data ?? [];
  const processedData = Array.isArray(data)
    ? data.filter((item) => item && typeof item === "object")
    : [];

  const hasData = processedData.length > 0;
  const isEmpty = !(isLoading || error || hasData);

  return {
    data: processedData,
    error,
    hasData,
    isEmpty,
    isLoading,
    refetch,
  };
}

// Specific hook for financial charts
export function useFinancialChart(
  queryKey: string[],
  queryFn: () => Promise<ChartQueryResponse>,
) {
  const result = useChart({ queryFn, queryKey });

  // Add financial-specific processing
  const processedData = result.data.map((item) => {
    const income = Number(item.income);
    const expense = Number(item.expense);
    const amount = Number(item.amount);
    return {
      ...item,
      amount: Number.isFinite(amount) ? Math.abs(amount) : 0,
      expense: Number.isFinite(expense) ? Math.max(0, expense) : 0,
      income: Number.isFinite(income) ? Math.max(0, income) : 0,
    };
  });

  // Calculate totals
  const totals = processedData.reduce(
    (acc, item) => ({
      amount: acc.amount + item.amount,
      expense: acc.expense + item.expense,
      income: acc.income + item.income,
    }),
    { amount: 0, expense: 0, income: 0 },
  );

  return {
    ...result,
    data: processedData,
    netIncome: totals.income - totals.expense,
    totals,
  };
}
