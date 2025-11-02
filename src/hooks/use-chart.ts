import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "./use-route-user";

export interface ChartData {
  [key: string]: any;
}

export interface ChartHookOptions {
  queryKey: string[];
  queryFn: () => Promise<any>;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
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
  staleTime = 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus = false,
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
    staleTime,
    refetchOnWindowFocus,
  });

  // Process and sanitize data
  const data = rawData?.data ?? [];
  const processedData = Array.isArray(data)
    ? data.filter((item: any) => item && typeof item === "object")
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
  queryFn: () => Promise<any>
) {
  const result = useChart({ queryKey, queryFn });

  // Add financial-specific processing
  const processedData = result.data.map((item: any) => ({
    ...item,
    income: Number.isFinite(item.income) ? Math.max(0, item.income) : 0,
    expense: Number.isFinite(item.expense) ? Math.max(0, item.expense) : 0,
    amount: Number.isFinite(item.amount) ? Math.abs(item.amount) : 0,
  }));

  // Calculate totals
  const totals = processedData.reduce(
    (acc, item) => ({
      income: acc.income + (item.income || 0),
      expense: acc.expense + (item.expense || 0),
      amount: acc.amount + (item.amount || 0),
    }),
    { income: 0, expense: 0, amount: 0 }
  );

  return {
    ...result,
    data: processedData,
    totals,
    netIncome: totals.income - totals.expense,
  };
}
