import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import {
  DEFAULT_CURRENCY,
  type SupportedCurrency,
} from "~/utils/format-currency";
import { queryKeys } from "~/utils/query-keys";

/**
 * The user's persisted display currency, falling back to USD when unset.
 * Shares the cached `[user, email]` query, so it adds no extra requests.
 */
export function usePreferredCurrency(): SupportedCurrency {
  const userEmail = useRouteUser();

  const { data } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: queryKeys.user.byEmail(userEmail),
    staleTime: 1000 * 60 * 5,
  });

  return (
    (data?.data?.preferredCurrency as SupportedCurrency | undefined) ??
    DEFAULT_CURRENCY
  );
}
