import { createFileRoute } from "@tanstack/react-router";
import { ListIcon } from "lucide-react";
import AddCategory from "~/components/categories/AddCategory";
import { AvailableIconsGallery } from "~/components/categories/AvailableIconsGallery";
import { CategoriesList } from "~/components/categories/list";
import { PageHeader } from "~/components/layout/PageHeader";
import { Separator } from "~/components/ui/separator";

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

      <AddCategory />
      <CategoriesList />

      <Separator className="bg-border/60" />

      <AvailableIconsGallery />
    </div>
  );
}
