import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getActiveLoansByEmailServer } from "~/lib/api/loan/get-active-loans-by-email";
import { queryDictionary } from "~/queries/dictionary";

type UseActiveLoansOptions = {
  /**
   * When provided, the response will include this loan even if it's already
   * fully paid. Used by the edit-transaction form so the currently linked
   * loan stays visible while the user edits.
   */
  includeId?: string | null;
};

/**
 * Loans that still have an outstanding balance, projected to the minimum
 * fields the transaction form picker needs. Cached separately from
 * `useLoans()` so opening the form doesn't blow away the loans list cache.
 */
export const useActiveLoans = (options: UseActiveLoansOptions = {}) => {
  const userEmail = useRouteUser();
  const includeId = options.includeId ?? null;

  return useQuery({
    queryKey: [queryDictionary.activeLoans, userEmail, includeId ?? "none"],
    queryFn: () =>
      getActiveLoansByEmailServer({
        data: { email: userEmail, includeId },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });
};
