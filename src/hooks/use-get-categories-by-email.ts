import type { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getCategoryByEmailServer } from "~/lib/api/category/get-category-by-email.server";
import { queryDictionary } from "~/queries/dictionary";

import { useRouteUser } from "./use-route-user";

export const useGetCategoriesByEmail = () => {
  try {
    const userEmail = useRouteUser();

    const { data, isPending, error } = useQuery({
      queryKey: [queryDictionary.categories, userEmail],
      queryFn: () => getCategoryByEmailServer({ data: { email: userEmail } }),
      enabled: !!userEmail,
    });

    return { data: data?.data as Category[], isPending, error };
  } catch (error) {
    console.error(error);
    return { data: [], isPending: false, error: error as Error };
  }
};
