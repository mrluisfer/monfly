import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";

export type ChartData = Record<string, unknown>;

export interface ChartQueryResponse {
  data?: ChartData[] | null;
}

export interface ChartHookOptions {
  queryKey: string[];
  queryFn: () => Promise<ChartQueryResponse>;
  enabled?: boolean;
}

export interface ChartHookResult {
  data: ChartData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasData: boolean;
  isEmpty: boolean;
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
    queryKey: [...queryKey, userEmail],
    queryFn,
    enabled: enabled && !!userEmail,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  // Process and sanitize data
  const data = rawData?.data ?? [];
  const processedData = Array.isArray(data)
    ? data.filter((item) => item && typeof item === "object")
    : [];

  const hasData = processedData.length > 0;
  const isEmpty = !isLoading && !error && !hasData;

  return {
    data: processedData,
    isLoading,
    error,
    refetch,
    hasData,
    isEmpty,
  };
}

// Specific hook for financial charts
export function useFinancialChart(
  queryKey: string[],
  queryFn: () => Promise<ChartQueryResponse>,
) {
  const result = useChart({ queryKey, queryFn });

  // Add financial-specific processing
  const processedData = result.data.map((item) => {
    const income = Number(item.income);
    const expense = Number(item.expense);
    const amount = Number(item.amount);
    return {
      ...item,
      income: Number.isFinite(income) ? Math.max(0, income) : 0,
      expense: Number.isFinite(expense) ? Math.max(0, expense) : 0,
      amount: Number.isFinite(amount) ? Math.abs(amount) : 0,
    };
  });

  // Calculate totals
  const totals = processedData.reduce(
    (acc, item) => ({
      income: acc.income + item.income,
      expense: acc.expense + item.expense,
      amount: acc.amount + item.amount,
    }),
    { income: 0, expense: 0, amount: 0 },
  );

  return {
    ...result,
    data: processedData,
    totals,
    netIncome: totals.income - totals.expense,
  };
}
