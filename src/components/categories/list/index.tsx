import type { Category } from "@prisma/client";
import { useMemo, useState } from "react";
import { FolderOpen, Loader2, Search, X } from "lucide-react";

import { getCategoryIconByName, getCategoryIconLabelByName } from "~/constants/categories-icon";
import { useCategoriesList } from "~/hooks/categories/useCategoriesList";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import { StatusBadge } from "~/components/ui/status-badge";

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
      const name = category.name?.toLowerCase() ?? "";
      const iconName = category.icon?.toLowerCase() ?? "";
      const iconLabel = getCategoryIconLabelByName(category.icon).toLowerCase();
      return (
        name.includes(normalizedQuery) ||
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
    return <CategoriesSkeleton />;
  }

  if (error) {
    return (
      <Empty className="border-border/60 rounded-2xl border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
            <X aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Error loading categories</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (categoriesCount === 0) {
    return (
      <Empty className="border-border/60 bg-card rounded-2xl border py-20">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
            <FolderOpen aria-hidden="true" />
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
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight">
            Your categories
          </h2>
          <StatusBadge variant="neutral" size="sm">
            {categoriesCount}
          </StatusBadge>
        </div>
        {selectedCount > 0 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete {selectedCount}
          </Button>
        )}
      </header>

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

      {filteredCategories.length === 0 && isFiltering && (
        <Empty className="border-border/60 rounded-2xl border py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted">
              <Search aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No matches</EmptyTitle>
            <EmptyDescription>
              No categories match{" "}
              <span className="text-foreground font-medium">
                &ldquo;{searchValue}&rdquo;
              </span>
              . Try a different term.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {filteredCategories.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

      {filteredCategories.length > 0 && viewMode === "list" && (
        <ul
          role="list"
          className="bg-card border-border/60 divide-border/60 divide-y overflow-hidden rounded-2xl border"
        >
          {filteredCategories.map((category) => {
            const isSelected = selectedSet.has(category.id);
            const checkboxId = `list-cat-${category.id}`;
            return (
              <li
                key={category.id}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 transition-colors",
                  "hover:bg-accent/40",
                  isSelected && "bg-primary/[0.04]"
                )}
              >
                <Checkbox
                  id={checkboxId}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(category.id, checked)
                  }
                  className="shrink-0"
                  aria-label={`Select ${category.name}`}
                />
                <label
                  htmlFor={checkboxId}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isSelected
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    {getCategoryIconByName(category.icon, {
                      className: "size-4",
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium capitalize">
                      {category.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {getCategoryIconLabelByName(category.icon)}
                    </p>
                  </div>
                </label>
                <div className="shrink-0">
                  <CategoryItem category={category} compact />
                </div>
              </li>
            );
          })}
        </ul>
      )}

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

function CategoriesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-sm" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
      <span className="sr-only" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Loading categories
      </span>
    </div>
  );
}
