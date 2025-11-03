import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { deleteCategoriesByIdServer } from "~/lib/api/category/delete-categories-by-id.server";
import { getCategoryByEmailServer } from "~/lib/api/category/get-category-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { toast } from "sonner";

export const useCategoriesList = () => {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.categories, userEmail],
    queryFn: () => getCategoryByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  const deleteCategoriesByIdMutation = useMutation({
    fn: deleteCategoriesByIdServer,
    onSuccess: async (ctx) => {
      if (ctx.data?.error) {
        toast.error(ctx.data.message);
        return;
      }
      toast.success(ctx.data.message);
      setSelectedCategories([]);
      // Import the function at the top and use it
      const { invalidateCategoryQueries } = await import(
        "~/utils/query-invalidation"
      );
      await invalidateCategoryQueries(queryClient, userEmail);
    },
  });

  const handleCheckboxChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  const handleDeleteCategories = async () => {
    if (selectedCategories.length === 0) return;
    try {
      await deleteCategoriesByIdMutation.mutate({
        data: { ids: selectedCategories },
      });
    } catch {
      toast.error("Error deleting categories");
    }
  };

  return {
    data,
    isPending,
    error,
    selectedCategories,
    handleCheckboxChange,
    handleDeleteCategories,
  };
};
