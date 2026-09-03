import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getLoansByEmailServer } from "~/lib/api/loan/get-loans-by-email";
import { queryDictionary } from "~/queries/dictionary";

interface UseLoansOptions {
  status?: string;
}

export const useLoans = (options: UseLoansOptions = {}) => {
  const userEmail = useRouteUser();
  const { status } = options;

  return useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 5,
    queryFn: () =>
      getLoansByEmailServer({
        data: { email: userEmail, status },
      }),
    queryKey: [queryDictionary.loans, userEmail, status ?? "all"],
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
  });
};
