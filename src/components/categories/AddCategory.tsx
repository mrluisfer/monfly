import { useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { getCanonicalCategoryIconName } from "@/constants/categories/categories-icon";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateCategoryQueries } from "~/utils/query-invalidation";

import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { CategoryForm } from "./CategoryForm";

export default function AddCategory() {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create category" });
        return;
      }

      sileo.success({ title: "Category created successfully" });
      // Collapsing unmounts the panel, which also clears the form for the next one.
      setOpen(false);
      await invalidateCategoryQueries(queryClient, userEmail);
    },
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          email: variables.data.email,
          icon: variables.data.category.icon,
          name: variables.data.category.name.trim().toLowerCase(),
        }),
      onDuplicatePending: {
        title: "Category is already being created",
      },
      onDuplicateRecentSuccess: {
        title: "Category already created",
      },
    },
  });

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      await postCategoryByEmail.mutate({
        data: {
          email: userEmail,
          category: {
            name: data[categoryFormNames.name],
            icon: getCanonicalCategoryIconName(data[categoryFormNames.icon]),
          },
        },
      });
    } catch {
      sileo.error({ title: "Error creating category" });
    }
  };

  const isLoading = postCategoryByEmail.status === "pending";

  return (
    <Collapsible open={open} onOpenChange={setOpen} render={<Card />}>
      {/* Default Trigger render is a <button>, so aria-expanded and keyboard
          activation come for free — hence the card header styles live here. */}
      <CollapsibleTrigger className="group focus-visible:ring-ring/50 mx-(--card-spacing) flex items-center gap-2.5 rounded-md text-left outline-none focus-visible:ring-3">
        <span
          aria-hidden="true"
          className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-4xl"
        >
          <PlusCircleIcon className="text-primary size-4.5" />
        </span>
        <div className="min-w-0">
          <CardTitle>New Category</CardTitle>
          <CardDescription>
            Add a new expense or income category
          </CardDescription>
        </div>
        <ChevronDownIcon className="text-muted-foreground ml-auto size-4 shrink-0 transition-transform group-data-[panel-open]:rotate-180 motion-reduce:transition-none" />
      </CollapsibleTrigger>
      {/* Height animation driven by Base UI's own CSS var, same as ui/accordion. */}
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-250 ease-in-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
        <CardContent>
          <CategoryForm
            submitText="Create category"
            loading={isLoading}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );
}
