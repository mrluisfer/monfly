import { queryOptions } from "@tanstack/react-query";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";

export const userByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryKey: [queryDictionary.user, email] as const,
    queryFn: ({ queryKey }) => {
      const [_, email] = queryKey;
      return getUserByEmailServer({ data: { email } });
    },
  });
