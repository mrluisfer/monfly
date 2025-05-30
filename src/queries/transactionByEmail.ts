import { queryOptions } from "@tanstack/react-query";
import { getTransactionByEmail } from "~/lib/api/transactionByEmail";

// export const usersQueryOptions = queryOptions({
// 	queryKey: ["users"] as const,
// 	queryFn: fetchUsers,
// });

export const transactionByEmailQueryOptions = (email: string) =>
	queryOptions({
		queryKey: ["transactionByEmail", email] as const,
		queryFn: getTransactionByEmail,
	});
