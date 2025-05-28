import type { User } from "@prisma/client";
import { type QueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchUsers } from "~/lib/api/fetchUsers";
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
