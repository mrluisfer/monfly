import { getCategoryIconByName } from "@/constants/categories-icon";
import { Category } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import CategoryItem from "./CategoryItem";

export function CategoryCard({
  category,
  isSelected,
  onCheckChange,
}: {
  category: Category;
  isSelected: boolean;
  onCheckChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-4xl border border-border/60 bg-background p-4 text-center transition-all",
        "hover:border-border hover:shadow-sm",
        isSelected && "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
      )}
    >
      {/* Selection checkbox */}
      <div className="absolute left-3 top-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onCheckChange}
          className="size-4"
        />
      </div>

      {/* Icon */}
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-4xl transition-colors",
          isSelected ? "bg-primary/15 text-primary" : "bg-muted text-foreground"
        )}
      >
        {getCategoryIconByName(category.icon, {
          className: "size-5",
        })}
      </div>

      {/* Name */}
      <span className="w-full truncate text-sm font-medium capitalize text-foreground">
        {category.name}
      </span>

      {/* Edit button (appears on hover) */}
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <CategoryItem category={category} compact />
      </div>
    </div>
  );
}
