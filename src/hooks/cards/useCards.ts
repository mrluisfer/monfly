import { useQuery } from "@tanstack/react-query";

import { useRouteUser } from "~/hooks/useRouteUser";
import { getCardsByEmailServer } from "~/lib/api/card/get-cards-by-email";
import { queryKeys } from "~/utils/query-keys";

type UseCardsOptions = {
  status?: string;
};

export const useCards = (options: UseCardsOptions = {}) => {
  const userEmail = useRouteUser();
  const { status } = options;

  return useQuery({
    queryKey: [...queryKeys.cards.byEmail(userEmail), status ?? "all"],
    queryFn: () =>
      getCardsByEmailServer({
        data: { email: userEmail, status },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });
};
