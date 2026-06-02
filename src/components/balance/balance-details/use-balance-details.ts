import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";

import { deriveBalanceSummary } from "./derive-balance-summary";
import type { BalanceSummary } from "./types";

type UseBalanceDetailsResult = {
  summary: BalanceSummary;
  isPending: boolean;
  error: unknown;
};

/**
 * Fetches the user balance and income/expense series, then derives the
 * aggregated {@link BalanceSummary} consumed by the balance details surface.
 */
export function useBalanceDetails(): UseBalanceDetailsResult {
  const userEmail = useRouteUser();

  const { data: userData, isPending: isUserPending } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });

  const {
    data: incomeExpenseData,
    isPending: isIncomeExpensePending,
    error,
  } = useQuery({
    queryKey: [queryDictionary.incomeExpenseData, userEmail],
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  const balanceValue = Number(userData?.data?.totalBalance ?? 0);

  const summary = useMemo(
    () => deriveBalanceSummary(incomeExpenseData?.data, balanceValue),
    [incomeExpenseData?.data, balanceValue],
  );

  return {
    summary,
    isPending: isUserPending || isIncomeExpensePending,
    error,
  };
}
