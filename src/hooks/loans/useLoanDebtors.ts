import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getLoanDebtorsByEmailServer } from "~/lib/api/loan/get-loan-debtors-by-email";
import { queryKeys } from "~/utils/query-keys";

/**
 * Distinct counterparty names the user has used on past loans, for the loan
 * form's debtor/creditor autocomplete. Cached a few minutes since the set
 * barely changes between sessions; `invalidateLoanQueries` refreshes it when a
 * new loan introduces a name.
 */
export const useLoanDebtors = () => {
  const userEmail = useRouteUser();

  return useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getLoanDebtorsByEmailServer({ data: { email: userEmail } }),
    queryKey: queryKeys.loans.debtors(userEmail),
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  });
};
