import { queryOptions } from "@tanstack/react-query";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";

export const userByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryFn: () => getUserByEmailServer({ data: { email } }),
    queryKey: [queryDictionary.user, email] as const,
  });
