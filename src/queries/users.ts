import { queryOptions } from "@tanstack/react-query";
import { getAllUsersServer } from "~/lib/api/user/get-all-users";

export const usersQueryOptions = queryOptions({
	queryKey: ["getAllUsers"] as const,
	queryFn: getAllUsersServer,
});
