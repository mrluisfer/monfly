import { queryOptions } from "@tanstack/react-query";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { queryDictionary } from "~/queries/dictionary";

// export const usersQueryOptions = queryOptions({
// 	queryKey: ["users"] as const,
// 	queryFn: fetchUsers,
// });

export const transactionByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryFn: () => getTransactionByEmailServer({ data: { email } }),
    queryKey: [queryDictionary.transactions, email] as const,
  });
