import { Category } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { categoryFormNames } from "~/constants/category-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { putCategoryByIdServer } from "~/lib/api/category/put-category-by-id.server";
import { queryDictionary } from "~/queries/dictionary";
import { toast } from "sonner";

import { CategoryForm } from "./category-form";

export function EditCategory({
  category,
  onCloseDialog,
}: {
  category: Category;
  onCloseDialog?: () => void;
}) {
  const queryClient = useQueryClient();

  const updateCategory = useMutation({
    fn: putCategoryByIdServer,
    onSuccess: async () => {
      toast.success("Category updated successfully");
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.categories],
      });
      onCloseDialog?.();
    },
  });
  const handleSubmit = async (data: Record<string, string>) => {
    const name = data[categoryFormNames.name]?.trim();
    const icon = data[categoryFormNames.icon]?.trim();

    if (!name || !icon) {
      toast.error("Name and icon are required");
      return;
    }

    try {
      await updateCategory.mutate({
        data: {
          categoryId: category.id,
          name,
          icon,
        },
      });
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  return (
    <CategoryForm
      initialValues={{
        [categoryFormNames.name]: category.name,
        [categoryFormNames.icon]: category.icon,
      }}
      submitText="Save changes"
      loading={updateCategory.status === "pending"}
      onSubmit={handleSubmit}
    />
  );
}
