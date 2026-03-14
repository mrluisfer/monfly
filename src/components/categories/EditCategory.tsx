import type { Category } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getCanonicalCategoryIconName } from "~/constants/categories-icon";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { putCategoryByIdServer } from "~/lib/api/category/put-category-by-id";
import { sileo } from "~/lib/toaster";

import { CategoryForm } from "./CategoryForm";

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
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to update category" });
        return;
      }

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
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          categoryId: variables.data.categoryId,
          icon: variables.data.icon,
          name: variables.data.name.trim().toLowerCase(),
        }),
      onDuplicatePending: {
        title: "Category changes are already being saved",
      },
      onDuplicateRecentSuccess: {
        title: "Category changes already applied",
      },
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
          icon: getCanonicalCategoryIconName(icon),
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
        [categoryFormNames.icon]: getCanonicalCategoryIconName(category.icon),
      }}
      submitText="Save changes"
      loading={updateCategory.status === "pending"}
      onSubmit={handleSubmit}
    />
  );
}
