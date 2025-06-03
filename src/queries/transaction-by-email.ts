import { queryOptions } from "@tanstack/react-query";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email.server";

// export const usersQueryOptions = queryOptions({
// 	queryKey: ["users"] as const,
// 	queryFn: fetchUsers,
// });

export const transactionByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryKey: ["getTransactionByEmailServer", email] as const,
    queryFn: async ({ queryKey: [_, email] }) => {
      return getTransactionByEmailServer({ data: { email } });
    },
  });
