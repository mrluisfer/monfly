import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useActiveCard, useCards } from "~/hooks/cards";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";
import { queryKeys } from "~/utils/query-keys";

import { deriveBalanceSummary } from "./derive-balance-summary";
import type { BalanceSummary } from "./types";

interface UseBalanceDetailsResult {
  error: unknown;
  isPending: boolean;
  summary: BalanceSummary;
}

/**
 * Fetches the user balance and income/expense series, then derives the
 * aggregated {@link BalanceSummary} consumed by the balance details surface.
 */
export function useBalanceDetails(): UseBalanceDetailsResult {
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();

  const { data: userData, isPending: isUserPending } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.user, userEmail],
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  });

  const { data: cardsData } = useCards();

  const {
    data: incomeExpenseData,
    isPending: isIncomeExpensePending,
    error,
  } = useQuery({
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

  // Card-scoped view shows the card balance; otherwise the global user total.
  const balanceValue = activeCard
    ? Number(
        cardsData?.data?.find((card) => card.id === activeCard)?.balance ?? 0,
      )
    : Number(userData?.data?.totalBalance ?? 0);

  const summary = useMemo(
    () => deriveBalanceSummary(incomeExpenseData?.data, balanceValue),
    [incomeExpenseData?.data, balanceValue],
  );

  return {
    error,
    isPending: isUserPending || isIncomeExpensePending,
    summary,
  };
}
