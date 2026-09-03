import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getActiveLoansByEmailServer } from "~/lib/api/loan/get-active-loans-by-email";
import { queryDictionary } from "~/queries/dictionary";

interface UseActiveLoansOptions {
  /**
   * When provided, the response will include this loan even if it's already
   * fully paid. Used by the edit-transaction form so the currently linked
   * loan stays visible while the user edits.
   */
  includeId?: string | null;
}

/**
 * Loans that still have an outstanding balance, projected to the minimum
 * fields the transaction form picker needs. Cached separately from
 * `useLoans()` so opening the form doesn't blow away the loans list cache.
 */
export const useActiveLoans = (options: UseActiveLoansOptions = {}) => {
  const userEmail = useRouteUser();
  const includeId = options.includeId ?? null;

  return useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 5,
    queryFn: () =>
      getActiveLoansByEmailServer({
        data: { email: userEmail, includeId },
      }),
    queryKey: [queryDictionary.activeLoans, userEmail, includeId ?? "none"],
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
  });
};
