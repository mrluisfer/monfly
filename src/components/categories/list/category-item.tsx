import { useState } from "react";
import type { Category } from "@prisma/client";
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
import { Pencil } from "lucide-react";

import { EditCategory } from "../edit-category";

const CategoryItem = ({ category }: { category: Category }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <div
        key={category.id}
        className="flex items-center justify-between py-1 w-full group"
      >
        <div className="flex items-center gap-4">
          <div className="text-primary">
            {getCategoryIconByName(category.icon, {
              width: 16,
              height: 16,
            })}
          </div>
          <span className="capitalize">{category.name}</span>
        </div>
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-200">
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="p-1">
              <Pencil />
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details of your category below. Make sure to save your
            changes.
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
