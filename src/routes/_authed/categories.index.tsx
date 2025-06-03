import { createFileRoute } from "@tanstack/react-router";
import AddCategory from "~/components/categories/add-category";
import { CategoriesList } from "~/components/categories/list";

export const Route = createFileRoute("/_authed/categories/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid grid-cols-5 gap-4">
			<div className="col-span-2">
				<AddCategory />
			</div>
			<div className="col-span-3">
				<CategoriesList />
			</div>
		</div>
	);
}
