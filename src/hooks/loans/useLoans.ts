import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getLoansByEmailServer } from "~/lib/api/loan/get-loans-by-email";
import { queryDictionary } from "~/queries/dictionary";

type UseLoansOptions = {
  status?: string;
};

export const useLoans = (options: UseLoansOptions = {}) => {
  const userEmail = useRouteUser();
  const { status } = options;

  return useQuery({
    queryKey: [queryDictionary.loans, userEmail, status ?? "all"],
    queryFn: () =>
      getLoansByEmailServer({
        data: { email: userEmail, status },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });
};
