import type { Category } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "~/components/ui/dropdown-menu";
import { useMutation } from "~/hooks/use-mutation";
import { deleteCategoryByIdServer } from "~/lib/api/category/delete-category-by-id.server";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

const CategoryItemActions = ({ category }: { category: Category }) => {
  const queryClient = useQueryClient();

  const deleteCategoryByIdMutation = useMutation({
    fn: deleteCategoryByIdServer,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <div>
      <DropdownMenuItem>
        Edit
        <DropdownMenuShortcut>
          <Pencil />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() =>
          deleteCategoryByIdMutation.mutate({ data: { id: category.id } })
        }
      >
        Delete
        <DropdownMenuShortcut>
          <Trash className="text-destructive" />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    </div>
  );
};

export default CategoryItemActions;
