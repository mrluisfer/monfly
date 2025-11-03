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

  const handleSelectAll = () => {
    if (!data?.data) return;
    const allCategoryIds = data.data.map((category) => category.id);
    setSelectedCategories(allCategoryIds);
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  // Computed values for selection state
  const totalCategories = data?.data?.length || 0;
  const selectedCount = selectedCategories.length;
  const isAllSelected =
    totalCategories > 0 && selectedCount === totalCategories;
  const isPartiallySelected =
    selectedCount > 0 && selectedCount < totalCategories;
  const hasAnySelected = selectedCount > 0;
  const selectionPercentage =
    totalCategories > 0 ? (selectedCount / totalCategories) * 100 : 0;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
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

  // Helper functions for specific operations
  const isSelected = (categoryId: string) =>
    selectedCategories.includes(categoryId);
  const getSelectedCategories = () =>
    data?.data?.filter((cat) => selectedCategories.includes(cat.id)) || [];
  const getUnselectedCategories = () =>
    data?.data?.filter((cat) => !selectedCategories.includes(cat.id)) || [];

  return {
    data,
    isPending,
    error,
    selectedCategories,
    handleCheckboxChange,
    handleDeleteCategories,
    handleSelectAll,
    handleDeselectAll,
    handleToggleSelectAll,
    // Selection state helpers
    totalCategories,
    selectedCount,
    isAllSelected,
    isPartiallySelected,
    hasAnySelected,
    selectionPercentage,
    // Additional helper functions
    isSelected,
    getSelectedCategories,
    getUnselectedCategories,
  };
};
