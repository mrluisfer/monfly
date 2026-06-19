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
    queryKey: queryKeys.loans.debtors(userEmail),
    queryFn: () => getLoanDebtorsByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });
};
