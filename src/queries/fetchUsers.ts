import type { User } from "@prisma/client";
import { type QueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchUsers } from "~/lib/api/fetchUsers";

export const usersQueryOptions = queryOptions({
	queryKey: ["users"] as const,
	queryFn: fetchUsers,
});
