import { useQueryClient } from "@tanstack/react-query";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { toast } from "sonner";

import Card from "../card";
import { CategoryForm } from "./category-form";

export default function AddCategory() {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    onSuccess: async () => {
      toast.success("Category created successfully");
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.categories],
      });
    },
  });

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      await postCategoryByEmail.mutate({
        data: {
          email: userEmail,
          category: {
            name: data[categoryFormNames.name],
            icon: data[categoryFormNames.icon],
          },
        },
      });
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  return (
    <Card title="Add Category">
      <CategoryForm
        submitText="Create new category"
        loading={postCategoryByEmail.status === "pending"}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
