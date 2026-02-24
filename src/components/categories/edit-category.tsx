import type { Category } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { putCategoryByIdServer } from "~/lib/api/category/put-category-by-id";
import { sileo } from "~/lib/toaster";

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
      sileo.success({ title: "Category updated successfully" });
      // Need to get userEmail first
      const { getUserSession } = await import("~/utils/user/get-user-session");
      const { data: userEmail } = await getUserSession();
      if (userEmail) {
        const { invalidateCategoryQueries } = await import(
          "~/utils/query-invalidation"
        );
        await invalidateCategoryQueries(queryClient, userEmail);
      }
      onCloseDialog?.();
    },
  });
  const handleSubmit = async (data: Record<string, string>) => {
    const name = data[categoryFormNames.name]?.trim();
    const icon = data[categoryFormNames.icon]?.trim();

    if (!name || !icon) {
      sileo.error({ title: "Name and icon are required" });
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
      sileo.error({ title: "Error updating category" });
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
