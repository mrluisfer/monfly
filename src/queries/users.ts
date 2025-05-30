import { queryOptions } from "@tanstack/react-query";
import { getUsers } from "~/lib/api/users";

export const usersQueryOptions = queryOptions({
	queryKey: ["users"] as const,
	queryFn: getUsers,
});
