import { createFileRoute } from "@tanstack/react-router";
import { ListIcon } from "lucide-react";
import AddCategory from "~/components/categories/AddCategory";
import { CategoriesList } from "~/components/categories/list";
import { PageHeader } from "~/components/layout/PageHeader";

export const Route = createFileRoute("/_authed/home/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={<ListIcon className="size-5" aria-hidden="true" />}
        title="Categories"
        description="Organize your transactions with custom categories."
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
        <div className="order-2 space-y-4 lg:sticky lg:top-20 lg:order-1 lg:self-start">
          <AddCategory />
        </div>
        <div className="order-1 lg:order-2">
          <CategoriesList />
        </div>
      </div>
    </div>
  );
}
