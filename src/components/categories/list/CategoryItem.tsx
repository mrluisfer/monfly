import { useState } from "react";
import type { Category } from "@prisma/client";
import { PencilIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { EditCategoryDialogContent } from "./EditCategoryDialogContent";

type CategoryItemProps = {
  category: Category;
};

const CategoryItem = ({ category }: CategoryItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Edit ${category.name}`}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded-full transition-colors"
                />
              }
            />
          }
        >
          <PencilIcon className="size-4" aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent side="top">Edit {category.name}</TooltipContent>
      </Tooltip>

      <EditCategoryDialogContent
        category={category}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </Dialog>
  );
};

export default CategoryItem;
