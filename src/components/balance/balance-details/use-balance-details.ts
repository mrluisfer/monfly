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
  const activeCard = useActiveCard();

  const { data: userData, isPending: isUserPending } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });

  const { data: cardsData } = useCards();

  const {
    data: incomeExpenseData,
    isPending: isIncomeExpensePending,
    error,
  } = useQuery({
    queryKey: queryKeys.charts.incomeExpense(userEmail, activeCard),
    queryFn: () =>
      getIncomeExpenseDataServer({
        data: { email: userEmail, cardId: activeCard },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
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
    summary,
    isPending: isUserPending || isIncomeExpensePending,
    error,
  };
}
