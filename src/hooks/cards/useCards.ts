import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getCardsByEmailServer } from "~/lib/api/card/get-cards-by-email";
import { queryKeys } from "~/utils/query-keys";

interface UseCardsOptions {
  status?: string;
}

export const useCards = (options: UseCardsOptions = {}) => {
  const userEmail = useRouteUser();
  const { status } = options;

  return useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 5,
    queryFn: () =>
      getCardsByEmailServer({
        data: { email: userEmail, status },
      }),
    queryKey: [...queryKeys.cards.byEmail(userEmail), status ?? "all"],
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
  });
};
