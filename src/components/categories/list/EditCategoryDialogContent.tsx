import type { Category } from "@prisma/client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { getCategoryIconByName } from "~/constants/categories/categories-icon";

import { EditCategory } from "../EditCategory";

type EditCategoryDialogContentProps = {
  category: Category;
  onClose: () => void;
};

export function EditCategoryDialogContent({
  category,
  onClose,
}: EditCategoryDialogContentProps) {
  return (
    <DialogContent className="sm:max-w-lg">
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
      <EditCategory category={category} onCloseDialog={onClose} />
    </DialogContent>
  );
}
