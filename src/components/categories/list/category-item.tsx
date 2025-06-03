import type { Category } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getCategoryIconByName } from "~/constants/categories-icon";
import CategoryItemActions from "./category-item-actions";

const CategoryItem = ({ category }: { category: Category }) => {
  return (
    <div
      key={category.id}
      className="flex items-center justify-between py-1 w-full"
    >
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground">
          {getCategoryIconByName(category.icon, {
            width: 16,
            height: 16,
          })}
        </div>
        <span className="capitalize">{category.name}</span>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <CategoryItemActions category={category} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CategoryItem;
