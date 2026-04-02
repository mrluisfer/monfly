import { Category } from "@prisma/client";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DeleteCategoryDialog({
  isOpen,
  onOpenChange,
  isDeleting,
  selectedCount,
  categories,
  selectedCategories,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  selectedCount: number;
  categories: Category[];
  selectedCategories: string[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      {/* Delete action bar */}
      {selectedCount > 0 && (
        <Card className="sticky bottom-3 z-10">
          <CardContent className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {selectedCount}
              </span>{" "}
              {selectedCount === 1 ? "category" : "categories"} selected
            </p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onOpenChange(true)}
              className="gap-1.5"
            >
              <Trash2Icon className="size-3.5" />
              Delete
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2Icon className="size-5 text-destructive" />
              Delete Selected Categories
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedCount}{" "}
                {selectedCount === 1 ? "category" : "categories"}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
            {selectedCount > 0 && (
              <div className="rounded-4xl flex-1 w-full border border-destructive/20 p-3">
                <div className="flex flex-1 w-full max-h-32 flex-wrap gap-1 overflow-y-auto">
                  {categories
                    .filter((cat) => selectedCategories.includes(cat.id))
                    .slice(0, 8)
                    .map((cat) => (
                      <Badge key={cat.id} variant="destructive">
                        {cat.name}
                      </Badge>
                    ))}
                  {selectedCount > 8 && (
                    <Badge variant="destructive">
                      +{selectedCount - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isDeleting}
              variant={"destructive"}
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2Icon className="size-4" />
                  Delete {selectedCount}{" "}
                  {selectedCount === 1 ? "Category" : "Categories"}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
