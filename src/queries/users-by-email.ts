import { queryOptions } from "@tanstack/react-query";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";

export const userByEmailQueryOptions = (email: string) =>
  queryOptions({
    queryKey: ["userByEmail", email] as const,
    queryFn: ({ queryKey }) => {
      const [_, email] = queryKey;
      return getUserByEmailServer({ data: { email } });
    },
  });
