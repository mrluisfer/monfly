import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryKeys } from "~/utils/query-keys";
import {
  DEFAULT_CURRENCY,
  type SupportedCurrency,
} from "~/utils/format-currency";

/**
 * The user's persisted display currency, falling back to USD when unset.
 * Shares the cached `[user, email]` query, so it adds no extra requests.
 */
export function usePreferredCurrency(): SupportedCurrency {
  const userEmail = useRouteUser();

  const { data } = useQuery({
    queryKey: queryKeys.user.byEmail(userEmail),
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return (
    (data?.data?.preferredCurrency as SupportedCurrency | undefined) ??
    DEFAULT_CURRENCY
  );
}
