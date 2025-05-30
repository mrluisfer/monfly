import { useQuery } from "@tanstack/react-query";
import { userByEmailQueryOptions } from "~/queries/usersByEmail";

export const useUser = (email: string) => {
	return useQuery(userByEmailQueryOptions(email));
};
