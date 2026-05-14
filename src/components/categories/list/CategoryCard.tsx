import { useState } from "react";
import { getCategoryIconByName } from "@/constants/categories-icon";
import type { Category } from "@prisma/client";
import { CheckIcon, PencilIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditCategory } from "../EditCategory";

type CategoryCardProps = {
  category: Category;
  isSelected: boolean;
  onCheckChange: (checked: boolean) => void;
};

export function CategoryCard({
  category,
  isSelected,
  onCheckChange,
}: CategoryCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div
      className={cn(
        "group bg-card text-card-foreground border-border/60 relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-4 text-center shadow-xs transition-all",
        "hover:border-border hover:-translate-y-0.5 hover:shadow-md",
        isSelected &&
          "border-primary/50 ring-primary/30 bg-primary/[0.04] ring-2",
      )}
    >
      {/* selection click target — covers the whole card except the buttons */}
      <button
        type="button"
        onClick={() => onCheckChange(!isSelected)}
        aria-pressed={isSelected}
        aria-label={`${isSelected ? "Deselect" : "Select"} ${category.name}`}
        className="focus-visible:ring-ring focus-visible:ring-offset-background absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      />

      {/* selection mark (top-left) */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-2.5 left-2.5 z-10 flex size-5 items-center justify-center rounded-full border transition-all",
          isSelected
            ? "border-primary bg-primary text-primary-foreground scale-100 opacity-100"
            : "border-border/80 bg-background scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100",
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
              variant="ghost"
              size="icon-xs"
              className={cn(
                "absolute top-2 right-2 z-10 size-7 rounded-full opacity-0 transition-opacity",
                "group-focus-within:opacity-100 group-hover:opacity-100",
                "hover:bg-muted",
              )}
              aria-label={`Edit ${category.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <PencilIcon className="size-3.5" aria-hidden="true" />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-xl">
                {getCategoryIconByName(category.icon, { className: "size-4" })}
              </div>
              Edit Category
            </DialogTitle>
            <DialogDescription>
              Update the details of your{" "}
              <strong className="text-foreground capitalize">
                {category.name}
              </strong>{" "}
              category below.
            </DialogDescription>
          </DialogHeader>
          <EditCategory
            category={category}
            onCloseDialog={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* icon */}
      <div
        aria-hidden="true"
        className={cn(
          "relative z-0 mt-2 flex size-14 items-center justify-center rounded-2xl transition-colors",
          isSelected
            ? "bg-primary/15 text-primary"
            : "bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary",
        )}
      >
        {getCategoryIconByName(category.icon, { className: "size-6" })}
      </div>

      {/* name */}
      <span
        className={cn(
          "relative z-0 w-full truncate text-sm font-medium capitalize",
          isSelected ? "text-foreground" : "text-foreground",
        )}
      >
        {category.name}
      </span>
    </div>
  );
}
