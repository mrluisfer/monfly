import type { Category } from "@prisma/client";
import { CheckIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getCategoryIconByName } from "@/constants/categories/categories-icon";
import { cn } from "@/lib/utils";

import { EditCategoryDialogContent } from "./EditCategoryDialogContent";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onCheckChange: (checked: boolean) => void;
}

export function CategoryCard({
  category,
  isSelected,
  onCheckChange,
}: CategoryCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 text-center text-card-foreground shadow-xs transition-all",
        "hover:-translate-y-0.5 hover:border-border hover:shadow-md",
        isSelected &&
          "border-primary/50 bg-primary/[0.04] ring-2 ring-primary/30",
      )}
    >
      {/* selection click target — covers the whole card except the buttons */}
      <button
        type="button"
        onClick={() => onCheckChange(!isSelected)}
        aria-pressed={isSelected}
        aria-label={`${isSelected ? "Deselect" : "Select"} ${category.name}`}
        className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />

      {/* selection mark (top-left) */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-2.5 left-2.5 z-10 flex size-5 items-center justify-center rounded-full border transition-all",
          isSelected
            ? "scale-100 border-primary bg-primary text-primary-foreground opacity-100"
            : "scale-90 border-border/80 bg-background opacity-0 group-hover:scale-100 group-hover:opacity-100",
        )}
      >
        <CheckIcon
          className={cn(
            "size-3 transition-opacity",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
      </span>

      {/* edit button (top-right) */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute top-2 right-2 z-10 rounded-full transition-opacity",
                // Desktop: reveal on hover/focus only. Touch devices (no hover)
                // always see it — there's no hover state to "wait for".
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
                "hover:bg-muted",
              )}
              aria-label={`Edit ${category.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <PencilIcon aria-hidden="true" />
            </Button>
          }
        />
        <EditCategoryDialogContent
          category={category}
          onClose={() => setEditOpen(false)}
        />
      </Dialog>

      {/* icon */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none relative z-0 mt-2 flex size-14 items-center justify-center rounded-2xl transition-colors",
          isSelected
            ? "bg-primary/15 text-primary"
            : "bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary",
        )}
      >
        {getCategoryIconByName(category.icon, { className: "size-6" })}
      </div>

      {/* name */}
      <span className="pointer-events-none relative z-0 w-full truncate font-medium text-foreground text-sm capitalize">
        {category.name}
      </span>
    </div>
  );
}
