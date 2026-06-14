import { useQueryClient } from "@tanstack/react-query";
import { getCanonicalCategoryIconName } from "@/constants/categories/categories-icon";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateCategoryQueries } from "~/utils/query-invalidation";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import { PlusCircleIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CategoryForm } from "./CategoryForm";

export default function AddCategory() {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();
  const shouldReduceMotion = useReducedMotion();

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create category" });
        return;
      }

      sileo.success({ title: "Category created successfully" });
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-2.5 space-y-0">
        <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-4xl">
          <PlusCircleIcon className="text-primary size-4.5" />
        </div>
        <div className="min-w-0 text-left">
          <CardTitle>New Category</CardTitle>
          <CardDescription>
            Add a new expense or income category
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            <m.div
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
            >
              <CategoryForm
                submitText="Create category"
                loading={isLoading}
                onSubmit={handleSubmit}
              />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </CardContent>
    </Card>
  );
}
