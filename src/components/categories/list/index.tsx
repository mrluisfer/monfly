import { useMemo, useState } from "react";
import type { Category } from "@prisma/client";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { getCategoryIconLabelByName } from "~/constants/categories-icon";
import { useCategoriesList } from "~/hooks/useCategoriesList";
import { cn } from "~/lib/utils";
import { FolderOpen, Loader2, Search, X } from "lucide-react";

import { CategoryCard } from "./CategoryCard";
import CategoryItem from "./CategoryItem";
import { CategoryToolbar } from "./CategoryToolbar";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

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
    handleSelectAll,
    handleDeselectAll,
    handleSelectCategories,
    handleDeselectCategories,
    totalCategories,
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
        selectedSet={selectedSet}
        handleSelectAll={handleSelectAll}
        handleDeselectAll={handleDeselectAll}
        handleSelectCategories={handleSelectCategories}
        handleDeselectCategories={handleDeselectCategories}
        totalCategories={totalCategories}
        selectedCount={selectedCount}
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

      {/* Delete dialog */}
      <DeleteCategoryDialog
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
