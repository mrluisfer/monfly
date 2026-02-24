import type { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getCategoryByEmailServer } from "~/lib/api/category/get-category-by-email";
import { queryDictionary } from "~/queries/dictionary";

import { useRouteUser } from "./use-route-user";

export const useGetCategoriesByEmail = () => {
  try {
    const userEmail = useRouteUser();

    const { data, isPending, error } = useQuery({
      queryKey: [queryDictionary.categories, userEmail],
      queryFn: () => getCategoryByEmailServer({ data: { email: userEmail } }),
      enabled: !!userEmail,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
      retry: 1,
      retryDelay: 1000,
    });

    return { data: data?.data as Category[], isPending, error };
  } catch (error) {
    console.error(error);
    return { data: [], isPending: false, error: error as Error };
  }
};
