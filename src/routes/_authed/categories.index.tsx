import { createFileRoute } from "@tanstack/react-router";
import AddCategory from "~/components/categories/add-category";
import { CategoriesList } from "~/components/categories/list";
import { PageTitle } from "~/components/page-title";

export const Route = createFileRoute("/_authed/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <header className="mb-6 flex justify-between items-center">
        <PageTitle description="Manage your categories here">
          Categories
        </PageTitle>
      </header>

      {/* Mobile: stacked layout, list first for immediate access */}
      <div className="flex flex-col gap-5 lg:hidden">
        <CategoriesList />
        <AddCategory />
      </div>

      {/* Desktop: side-by-side grid */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        <div className="col-span-2">
          <AddCategory />
        </div>
        <div className="col-span-3">
          <CategoriesList />
        </div>
      </div>
    </div>
  );
}
