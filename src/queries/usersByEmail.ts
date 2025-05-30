import { queryOptions } from "@tanstack/react-query";
import { getUsersByEmail } from "~/lib/api/usersByEmail";

export const userByEmailQueryOptions = (email: string) =>
	queryOptions({
		queryKey: ["userByEmail", email] as const,
		queryFn: ({ queryKey }) => {
			const [_, email] = queryKey;
			return getUsersByEmail(email);
		},
	});
