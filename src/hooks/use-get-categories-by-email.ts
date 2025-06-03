import { useQuery } from "@tanstack/react-query";
import { getCategoryByEmailServer } from "~/lib/api/category/get-category-by-email.server";
import { useRouteUser } from "./use-route-user";

export const useGetCategoriesByEmail = () => {
try {
    const userEmail = useRouteUser();

  const { data, isPending, error } = useQuery({
    queryKey: ["categories", userEmail],
    queryFn: () => getCategoryByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  return { data: data?.data, isPending, error };
} catch (error) {
  console.error(error);
  return { data: [], isPending: false, error: error as Error };
} 
};
