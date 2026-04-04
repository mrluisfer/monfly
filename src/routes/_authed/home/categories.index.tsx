import { createFileRoute } from "@tanstack/react-router";
import AddCategory from "~/components/categories/AddCategory";
import { CategoriesList } from "~/components/categories/list";
import { PageTitle } from "~/components/PageTitle";

export const Route = createFileRoute("/_authed/home/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <PageTitle description="Organize your transactions with custom categories">
        Categories
      </PageTitle>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
        <div className="order-2 space-y-4 lg:sticky lg:top-4 lg:order-1 lg:self-start">
          <AddCategory />
        </div>
        <div className="order-1 lg:order-2">
          <CategoriesList />
        </div>
      </div>
    </div>
  );
}
