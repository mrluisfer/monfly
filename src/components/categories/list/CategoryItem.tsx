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
import { getCategoryIconByName } from "@/constants/categories/categories-icon";
import { Pencil, Tag } from "lucide-react";

import { EditCategory } from "../EditCategory";

const CategoryItem = ({
  category,
  compact = false,
}: {
  category: Category;
  compact?: boolean;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (compact) {
    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger
          render={
            <Button
              variant="default"
              size="icon-sm"
              className="rounded-full"
              aria-label={`Edit ${category.name}`}
            >
              <Pencil className="size-3" />
            </Button>
          }
        />

        <EditDialog
          category={category}
          onClose={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <div className="group flex w-full min-w-0 items-center justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-4xl">
            {getCategoryIconByName(category.icon, {
              className: "size-4",
            })}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="truncate text-sm font-medium capitalize sm:text-base">
                {category.name}
              </span>
              <Badge variant="outline" className="hidden w-fit text-xs sm:flex">
                <Tag className="mr-1 size-3" />
                Category
              </Badge>
            </div>
          </div>
        </div>

        <div className="ml-2 shrink-0">
          <DialogTrigger render={<Button variant="default" size="icon" />}>
            <Pencil />
            <span className="sr-only">Edit {category.name}</span>
          </DialogTrigger>
        </div>
      </div>

      <EditDialog
        category={category}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </Dialog>
  );
};

function EditDialog({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="space-y-3">
        <DialogTitle className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-4xl">
            {getCategoryIconByName(category.icon, {
              className: "size-4",
            })}
          </div>
          Edit Category
        </DialogTitle>
        <DialogDescription>
          Update the details of your <strong>{category.name}</strong> category
          below.
        </DialogDescription>
      </DialogHeader>
      <EditCategory category={category} onCloseDialog={onClose} />
    </DialogContent>
  );
}

export default CategoryItem;
