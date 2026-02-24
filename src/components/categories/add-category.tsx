import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { categoryFormNames } from "~/constants/forms/category-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, PlusCircleIcon } from "lucide-react";

import Card from "../card";
import { CategoryForm } from "./category-form";

export default function AddCategory() {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    onSuccess: async () => {
      sileo.success({ title: "Category created successfully" });
      const { invalidateCategoryQueries } = await import(
        "~/utils/query-invalidation"
      );
      await invalidateCategoryQueries(queryClient, userEmail);
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
      sileo.error({ title: "Error creating category" });
    }
  };

  return (
    <>
      {/* Desktop: Card as before */}
      <div className="hidden lg:block">
        <Card title="Add Category">
          <CategoryForm
            submitText="Create new category"
            loading={postCategoryByEmail.status === "pending"}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>

      {/* Mobile: collapsible section */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex items-center justify-between w-full",
            "rounded-2xl px-4 py-3.5",
            "bg-primary/5 border border-primary/10",
            "active:scale-[0.98] transition-all duration-200"
          )}
        >
          <div className="flex items-center gap-2.5">
            <PlusCircleIcon className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              New Category
            </span>
          </div>
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3 px-1">
                <CategoryForm
                  submitText="Create new category"
                  loading={postCategoryByEmail.status === "pending"}
                  onSubmit={handleSubmit}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
