import { useMemo, useState } from "react";
import type { Category } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  getCategoryIconByName,
  getCategoryIconLabelByName,
} from "~/constants/categories-icon";
import { useCategoriesList } from "~/hooks/useCategoriesList";
import { cn } from "~/lib/utils";
import { FolderOpen, Loader2, Search, Trash2, X } from "lucide-react";

import CategoryItem from "./CategoryItem";
import { CategoryToolbar } from "./CategoryToolbar";

type ViewMode = "grid" | "list";

export const CategoriesList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data,
    isPending,
    error,
    selectedCategories,
    handleCheckboxChange,
    handleDeleteCategories,
    selectedCount,
  } = useCategoriesList();

  const allCategories = (data?.data ?? []) as Category[];
  const normalizedQuery = searchValue.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0;

  const filteredCategories = useMemo(() => {
    if (!isFiltering) return allCategories;

    return allCategories.filter((category) => {
      const categoryName = category.name?.toLowerCase() ?? "";
      const iconName = category.icon?.toLowerCase() ?? "";
      const iconLabel = getCategoryIconLabelByName(category.icon).toLowerCase();

      return (
        categoryName.includes(normalizedQuery) ||
        iconName.includes(normalizedQuery) ||
        iconLabel.includes(normalizedQuery)
      );
    });
  }, [allCategories, isFiltering, normalizedQuery]);

  const selectedSet = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories]
  );

  const handleConfirmDelete = async () => {
    if (selectedCategories.length === 0) return;
    setIsDeleting(true);
    try {
      await handleDeleteCategories();
      setIsDeleteDialogOpen(false);
    } catch (deleteError) {
      console.error("Error deleting categories:", deleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  const categoriesCount = allCategories.length;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm font-medium">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <X className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Error loading categories</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (categoriesCount === 0) {
    return (
      <Empty className="py-20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>No categories yet</EmptyTitle>
          <EmptyDescription>
            Create your first category using the form to start organizing your
            transactions.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <CategoryToolbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isFiltering={isFiltering}
        filteredCategories={filteredCategories}
        categoriesCount={categoriesCount}
      />

      {/* No results */}
      {filteredCategories.length === 0 && isFiltering && (
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No matches</EmptyTitle>
            <EmptyDescription>
              No categories match "{searchValue}". Try a different term.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* Grid view */}
      {filteredCategories.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedSet.has(category.id)}
              onCheckChange={(checked) =>
                handleCheckboxChange(category.id, checked)
              }
            />
          ))}
        </div>
      )}

      {/* List view */}
      {filteredCategories.length > 0 && viewMode === "list" && (
        <div className="space-y-1">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "flex items-center gap-2.5 rounded-4xl p-2.5 transition-colors",
                "hover:bg-accent/50",
                selectedSet.has(category.id) &&
                  "border border-primary/20 bg-primary/5 hover:bg-primary/10"
              )}
            >
              <Checkbox
                id={`list-cat-${category.id}`}
                checked={selectedSet.has(category.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(category.id, checked)
                }
                className="shrink-0"
              />
              <label
                htmlFor={`list-cat-${category.id}`}
                className="min-w-0 flex-1"
              >
                <CategoryItem category={category} />
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Delete action bar */}
      {selectedCount > 0 && (
        <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-4xl border border-border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
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
            onClick={() => setIsDeleteDialogOpen(true)}
            className="gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      )}

      {/* Delete dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
        selectedCount={selectedCount}
        categories={allCategories}
        selectedCategories={selectedCategories}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

function CategoryCard({
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

function DeleteDialog({
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
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Delete Selected Categories
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {selectedCount} {selectedCount === 1 ? "category" : "categories"}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
          {selectedCount > 0 && (
            <div className="rounded-4xl border border-destructive/20 bg-destructive/5 p-3">
              <p className="mb-2 flex items-center gap-1 text-sm font-medium text-destructive">
                <Trash2 className="size-3" />
                Categories to be deleted:
              </p>
              <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
                {categories
                  .filter((cat) => selectedCategories.includes(cat.id))
                  .slice(0, 8)
                  .map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="destructive"
                      className="text-xs"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                {selectedCount > 8 && (
                  <Badge variant="destructive" className="text-xs">
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
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete {selectedCount}{" "}
                {selectedCount === 1 ? "Category" : "Categories"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
