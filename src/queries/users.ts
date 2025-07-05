import { queryOptions } from "@tanstack/react-query";
import { getAllUsersServer } from "~/lib/api/user/get-all-users";
import { queryDictionary } from "~/queries/dictionary";

export const usersQueryOptions = queryOptions({
  queryKey: [queryDictionary.user] as const,
  queryFn: getAllUsersServer,
});
