import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { deleteCategoriesByIdServer } from "~/lib/api/category/delete-categories-by-id.server";
import { getCategoryByEmailServer } from "~/lib/api/category/get-category-by-email.server";
import { toast } from "sonner";

export const useCategoriesList = () => {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data, isPending, error } = useQuery({
    queryKey: ["categories", userEmail],
    queryFn: () => getCategoryByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  const deleteCategoriesByIdMutation = useMutation({
    fn: deleteCategoriesByIdServer,
    onSuccess: (ctx) => {
      if (ctx.data?.error) {
        toast.error(ctx.data.message);
        return;
      }
      toast.success(ctx.data.message);
      setSelectedCategories([]);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
