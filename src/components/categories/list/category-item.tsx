import { useState } from "react";
import type { Category } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getCategoryIconByName } from "~/constants/categories-icon";
import { cn } from "~/lib/utils";
import { Pencil, Tag } from "lucide-react";

import { EditCategory } from "../edit-category";

const CategoryItem = ({ category }: { category: Category }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <div className="flex items-center justify-between w-full min-w-0 group">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <div className="text-primary">
              {getCategoryIconByName(category.icon, {
                width: 16,
                height: 16,
              })}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base capitalize truncate">
                {category.name}
              </span>
              <Badge variant="outline" className="text-xs w-fit hidden sm:flex">
                <Tag className="w-3 h-3 mr-1" />
                Category
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate sm:hidden">
              ID: {category.id.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div className="shrink-0 ml-2">
          <div
            className="
            group-hover:scale-105
            scale-95
            transition-all duration-300 ease-out
            sm:opacity-60 sm:scale-100
            focus-within:opacity-100 focus-within:scale-105"
          >
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-8 w-8 p-0 rounded-md",
                    "hover:bg-primary/10 hover:text-primary hover:scale-110 hover:shadow-sm",
                    "focus:bg-primary/10 focus:text-primary focus:scale-110",
                    "active:scale-95",
                    "transition-all duration-200 ease-out",
                    "dark:hover:bg-primary/5 dark:hover:shadow-primary/10"
                  )}
                >
                  <Pencil className="transition-transform duration-200 hover:rotate-12" />
                  <span className="sr-only">Edit {category.name}</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <div className="text-primary">
                {getCategoryIconByName(category.icon, {
                  width: 16,
                  height: 16,
                })}
              </div>
            </div>
            Edit Category
          </DialogTitle>
          <DialogDescription>
            Update the details of your <strong>{category.name}</strong> category
            below. Changes will be saved automatically.
          </DialogDescription>
        </DialogHeader>
        <EditCategory
          category={category}
          onCloseDialog={() => {
            setIsEditDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryItem;
