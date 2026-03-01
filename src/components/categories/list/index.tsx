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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { getCategoryIconLabelByName } from "~/constants/categories-icon";
import { useCategoriesList } from "~/hooks/use-categories-list";
import { cn } from "~/lib/utils";
import {
  CheckCheck,
  FolderOpen,
  Loader2,
  Minus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import CategoryItem from "./category-item";

type CategoryRecord = Category;

export const CategoriesList = () => {
  const [searchValue, setSearchValue] = useState("");
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

  const allCategories = (data?.data ?? []) as CategoryRecord[];
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

  const filteredCategoryIds = useMemo(
    () => filteredCategories.map((category) => category.id),
    [filteredCategories]
  );
  const selectedCategoryIdSet = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories]
  );
  const selectedFilteredCount = useMemo(
    () =>
      filteredCategoryIds.reduce(
        (count, id) => (selectedCategoryIdSet.has(id) ? count + 1 : count),
        0
      ),
    [filteredCategoryIds, selectedCategoryIdSet]
  );

  const toolbarTotal = isFiltering
    ? filteredCategories.length
    : totalCategories;
  const toolbarSelected = isFiltering ? selectedFilteredCount : selectedCount;
  const toolbarIsAllSelected =
    toolbarTotal > 0 && toolbarSelected === toolbarTotal;
  const toolbarIsPartiallySelected =
    toolbarSelected > 0 && toolbarSelected < toolbarTotal;
  const toolbarHasAnySelected = toolbarSelected > 0;

  const selectToolbarScope = () => {
    if (isFiltering) {
      handleSelectCategories(filteredCategoryIds);
      return;
    }
    handleSelectAll();
  };

  const deselectToolbarScope = () => {
    if (isFiltering) {
      handleDeselectCategories(filteredCategoryIds);
      return;
    }
    handleDeselectAll();
  };

  const handleToolbarToggle = () => {
    if (toolbarIsAllSelected) {
      deselectToolbarScope();
      return;
    }
    selectToolbarScope();
  };

  const handleDeleteClick = () => {
    if (selectedCategories.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

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

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const categoriesCount = allCategories.length;
  const shouldRenderDeleteButton = categoriesCount > 0;

  return (
    <>
      <div className="hidden lg:block w-full max-w-4xl xl:max-w-5xl">
        <Card className="border shadow-sm backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FolderOpen className="size-5 text-primary" />
                  Categories
                  {categoriesCount > 0 && (
                    <Badge variant="secondary">{categoriesCount}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage and organize your expense categories
                </CardDescription>
              </div>
              {selectedCount > 0 && (
                <Badge variant="outline" className="shrink-0">
                  {selectedCount} selected
                </Badge>
              )}
            </div>

            <CategorySearch
              value={searchValue}
              onChange={setSearchValue}
              total={categoriesCount}
              filtered={filteredCategories.length}
              isMobile={false}
            />
          </CardHeader>

          <CardContent>
            <CategoriesContent
              categories={filteredCategories}
              allCategoriesCount={categoriesCount}
              isPending={isPending}
              error={error}
              isFiltering={isFiltering}
              searchValue={searchValue}
              selectedCategories={selectedCategories}
              handleCheckboxChange={handleCheckboxChange}
              toolbarTotal={toolbarTotal}
              toolbarSelected={toolbarSelected}
              toolbarIsAllSelected={toolbarIsAllSelected}
              toolbarIsPartiallySelected={toolbarIsPartiallySelected}
              toolbarHasAnySelected={toolbarHasAnySelected}
              onToggleToolbarSelection={handleToolbarToggle}
              onSelectToolbarScope={selectToolbarScope}
              onDeselectToolbarScope={deselectToolbarScope}
              shouldRenderDeleteButton={shouldRenderDeleteButton}
              onDeleteClick={handleDeleteClick}
              checkboxPrefix="desktop"
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden space-y-3">
        <div className="rounded-2xl border bg-background/80 px-3.5 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                <FolderOpen className="size-4 text-primary" />
                Categories
                {categoriesCount > 0 && (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {categoriesCount}
                  </span>
                )}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Search, select and edit quickly
              </p>
            </div>

            {selectedCount > 0 && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {selectedCount} selected
              </Badge>
            )}
          </div>

          <div className="mt-3">
            <CategorySearch
              value={searchValue}
              onChange={setSearchValue}
              total={categoriesCount}
              filtered={filteredCategories.length}
              isMobile
            />
          </div>
        </div>

        <CategoriesContent
          categories={filteredCategories}
          allCategoriesCount={categoriesCount}
          isPending={isPending}
          error={error}
          isFiltering={isFiltering}
          searchValue={searchValue}
          selectedCategories={selectedCategories}
          handleCheckboxChange={handleCheckboxChange}
          toolbarTotal={toolbarTotal}
          toolbarSelected={toolbarSelected}
          toolbarIsAllSelected={toolbarIsAllSelected}
          toolbarIsPartiallySelected={toolbarIsPartiallySelected}
          toolbarHasAnySelected={toolbarHasAnySelected}
          onToggleToolbarSelection={handleToolbarToggle}
          onSelectToolbarScope={selectToolbarScope}
          onDeselectToolbarScope={deselectToolbarScope}
          shouldRenderDeleteButton={shouldRenderDeleteButton}
          onDeleteClick={handleDeleteClick}
          checkboxPrefix="mobile"
          isMobile
        />
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
        selectedCount={selectedCount}
        categories={allCategories}
        selectedCategories={selectedCategories}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

function CategorySearch({
  value,
  onChange,
  total,
  filtered,
  isMobile,
}: {
  value: string;
  onChange: (value: string) => void;
  total: number;
  filtered: number;
  isMobile: boolean;
}) {
  const isFiltering = value.trim().length > 0;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search category by name or icon..."
          className={cn(
            "h-10 rounded-xl border-border/70 bg-background pl-9 pr-9 text-sm",
            isMobile && "h-11"
          )}
        />
        {isFiltering && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {isFiltering
          ? `Showing ${filtered} of ${total} categories`
          : `${total} categories available`}
      </p>
    </div>
  );
}

function CategoriesContent({
  categories,
  allCategoriesCount,
  isPending,
  error,
  isFiltering,
  searchValue,
  selectedCategories,
  handleCheckboxChange,
  toolbarTotal,
  toolbarSelected,
  toolbarIsAllSelected,
  toolbarIsPartiallySelected,
  toolbarHasAnySelected,
  onToggleToolbarSelection,
  onSelectToolbarScope,
  onDeselectToolbarScope,
  shouldRenderDeleteButton,
  onDeleteClick,
  checkboxPrefix,
  isMobile = false,
}: {
  categories: CategoryRecord[];
  allCategoriesCount: number;
  isPending: boolean;
  error: Error | null;
  isFiltering: boolean;
  searchValue: string;
  selectedCategories: string[];
  handleCheckboxChange: (id: string, checked: boolean) => void;
  toolbarTotal: number;
  toolbarSelected: number;
  toolbarIsAllSelected: boolean;
  toolbarIsPartiallySelected: boolean;
  toolbarHasAnySelected: boolean;
  onToggleToolbarSelection: () => void;
  onSelectToolbarScope: () => void;
  onDeselectToolbarScope: () => void;
  shouldRenderDeleteButton: boolean;
  onDeleteClick: () => void;
  checkboxPrefix: "desktop" | "mobile";
  isMobile?: boolean;
}) {
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm font-medium text-destructive">
          Error loading categories
        </p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  if (allCategoriesCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center px-6">
        <div className="mb-4 rounded-full bg-muted/60 p-4">
          <FolderOpen className="size-6 text-muted-foreground/60" />
        </div>
        <p className="font-medium text-muted-foreground">No categories found</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Create your first category to get started
        </p>
      </div>
    );
  }

  if (categories.length === 0 && isFiltering) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
        <Search className="mb-2 size-4 text-muted-foreground" />
        <p className="text-sm font-medium">No categories match your search</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try another term instead of{" "}
          <span className="font-medium text-foreground">"{searchValue}"</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {toolbarTotal > 0 && (
        <div
          className={cn(
            "rounded-xl border border-border/60 bg-muted/35 p-2.5",
            isMobile && "px-3 py-2.5"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Checkbox
                id={isMobile ? "select-visible-mobile" : "select-visible"}
                checked={toolbarIsAllSelected}
                indeterminate={toolbarIsPartiallySelected}
                onCheckedChange={onToggleToolbarSelection}
              />
              <label
                htmlFor={isMobile ? "select-visible-mobile" : "select-visible"}
                className="cursor-pointer truncate text-xs font-medium text-muted-foreground"
              >
                {toolbarIsAllSelected
                  ? "All visible selected"
                  : toolbarIsPartiallySelected
                    ? `${toolbarSelected} of ${toolbarTotal} visible`
                    : `Select visible (${toolbarTotal})`}
              </label>
            </div>

            {toolbarHasAnySelected && (
              <Badge variant="secondary" className="shrink-0 text-[11px]">
                {toolbarSelected}/{toolbarTotal}
              </Badge>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={onSelectToolbarScope}
              disabled={toolbarIsAllSelected}
              className="h-7 px-2 text-xs"
            >
              <CheckCheck className="size-3.5" />
              All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onDeselectToolbarScope}
              disabled={!toolbarHasAnySelected}
              className="h-7 px-2 text-xs"
            >
              <Minus className="size-3.5" />
              None
            </Button>
          </div>
        </div>
      )}

      <ScrollArea
        className={cn(
          "w-full rounded-xl border bg-background/60",
          isMobile ? "h-[52vh]" : "h-[56vh]"
        )}
      >
        <div className={cn("space-y-0.5", isMobile ? "p-1.5" : "p-2")}>
          {categories.map((category, index) => {
            const categoryCheckboxId = `${checkboxPrefix}-category-${category.id}`;

            return (
              <div key={category.id}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl p-2.5 transition-colors",
                    "hover:bg-accent/45 active:bg-accent/65",
                    selectedCategories.includes(category.id) &&
                      "border border-primary/20 bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  <Checkbox
                    id={categoryCheckboxId}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(category.id, checked)
                    }
                    className="shrink-0"
                  />
                  <label
                    htmlFor={categoryCheckboxId}
                    className="min-w-0 flex-1"
                  >
                    <CategoryItem category={category} />
                  </label>
                </div>
                {index < categories.length - 1 && (
                  <Separator className="my-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {shouldRenderDeleteButton && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 rounded-xl",
            isMobile
              ? "sticky bottom-2 border bg-background/90 p-2.5 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80"
              : "border-t pt-3"
          )}
        >
          <p className="text-xs text-muted-foreground">
            {selectedCategories.length > 0
              ? `${selectedCategories.length} ${selectedCategories.length === 1 ? "category" : "categories"} selected`
              : "No categories selected"}
          </p>
          <Button
            type="button"
            variant="destructive"
            disabled={selectedCategories.length === 0}
            onClick={onDeleteClick}
            size={isMobile ? "default" : "sm"}
            className={cn("gap-1.5", !isMobile && "h-8 text-xs")}
          >
            <Trash2 className="size-3.5" />
            Delete
            {selectedCategories.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-0.5 bg-destructive-foreground px-1 py-0 text-[10px] text-destructive"
              >
                {selectedCategories.length}
              </Badge>
            )}
          </Button>
        </div>
      )}
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
  categories: CategoryRecord[];
  selectedCategories: string[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Selected Categories
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              <p>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {selectedCount}{" "}
                  {selectedCount === 1 ? "category" : "categories"}
                </span>
                ? This action cannot be undone.
              </p>
              {selectedCount > 0 && (
                <div className="mt-3 rounded-md border border-destructive/20 bg-destructive/5 p-3">
                  <p className="mb-2 flex items-center gap-1 text-sm font-medium text-destructive">
                    <Trash2 className="h-3 w-3" />
                    Categories to be deleted:
                  </p>
                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {categories
                        .filter((cat) => selectedCategories.includes(cat.id))
                        .slice(0, 8)
                        .map((cat) => (
                          <Badge
                            key={cat.id}
                            variant="destructive"
                            className="border-destructive/20 bg-destructive/10 text-xs text-destructive"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                      {selectedCount > 8 && (
                        <Badge
                          variant="destructive"
                          className="border-destructive/20 bg-destructive/10 text-xs text-destructive"
                        >
                          +{selectedCount - 8} more...
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
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
