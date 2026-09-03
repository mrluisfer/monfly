import type { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getCategoryByEmailServer } from "~/lib/api/category/get-category-by-email";
import { queryDictionary } from "~/queries/dictionary";

export const useGetCategoriesByEmail = () => {
  const userEmail = useRouteUser();

  const { data, isPending, error } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getCategoryByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.categories, userEmail],
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  });

  return { data: (data?.data ?? []) as Category[], error, isPending };
};
