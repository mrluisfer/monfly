import { useEffect, useRef, useState } from "react";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useCategoriesList } from "~/hooks/use-categories-list";
import { cn } from "~/lib/utils";
import { CheckCheck, FolderOpen, Loader2, Minus, Trash2 } from "lucide-react";

import CategoryItem from "./category-item";

export const CategoriesList = () => {
  const selectAllCheckboxRef = useRef<HTMLButtonElement>(null);
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
    handleToggleSelectAll,
    totalCategories,
    selectedCount,
    isAllSelected,
    isPartiallySelected,
    hasAnySelected,
  } = useCategoriesList();

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const inputElement = selectAllCheckboxRef.current.querySelector("input");
      if (inputElement) {
        inputElement.indeterminate = isPartiallySelected;
      }
    }
  }, [isPartiallySelected]);

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
    } catch (error) {
      console.error("Error deleting categories:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const shouldRenderDeleteButton = (data?.data?.length ?? 0) > 0;
  const categoriesCount = data?.data?.length || 0;

  return (
    <>
      {/* ── Desktop: Card wrapper ── */}
      <div className="hidden lg:block w-full max-w-4xl xl:max-w-5xl">
        <Card className="shadow-sm border backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FolderOpen className="size-5 text-primary" />
                  Categories
                  {categoriesCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {categoriesCount}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage and organize your expense categories
                </CardDescription>
              </div>
              {selectedCount > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {selectedCount} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CategoriesContent
              isPending={isPending}
              error={error}
              categoriesCount={categoriesCount}
              data={data}
              totalCategories={totalCategories}
              selectAllCheckboxRef={selectAllCheckboxRef}
              isAllSelected={isAllSelected}
              isPartiallySelected={isPartiallySelected}
              handleToggleSelectAll={handleToggleSelectAll}
              selectedCount={selectedCount}
              hasAnySelected={hasAnySelected}
              handleSelectAll={handleSelectAll}
              handleDeselectAll={handleDeselectAll}
              selectedCategories={selectedCategories}
              handleCheckboxChange={handleCheckboxChange}
              shouldRenderDeleteButton={shouldRenderDeleteButton}
              handleDeleteClick={handleDeleteClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Mobile: clean, no Card ── */}
      <div className="lg:hidden">
        <MobileHeader
          categoriesCount={categoriesCount}
          selectedCount={selectedCount}
        />
        <CategoriesContent
          isPending={isPending}
          error={error}
          categoriesCount={categoriesCount}
          data={data}
          totalCategories={totalCategories}
          selectAllCheckboxRef={selectAllCheckboxRef}
          isAllSelected={isAllSelected}
          isPartiallySelected={isPartiallySelected}
          handleToggleSelectAll={handleToggleSelectAll}
          selectedCount={selectedCount}
          hasAnySelected={hasAnySelected}
          handleSelectAll={handleSelectAll}
          handleDeselectAll={handleDeselectAll}
          selectedCategories={selectedCategories}
          handleCheckboxChange={handleCheckboxChange}
          shouldRenderDeleteButton={shouldRenderDeleteButton}
          handleDeleteClick={handleDeleteClick}
          isMobile
        />
      </div>

      {/* ── Delete confirmation (shared) ── */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
        selectedCount={selectedCount}
        categories={data?.data ?? undefined}
        selectedCategories={selectedCategories}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

/* ─────────────────────────── Mobile Header ─────────────────────────── */

function MobileHeader({
  categoriesCount,
  selectedCount,
}: {
  categoriesCount: number;
  selectedCount: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <FolderOpen className="size-4.5 text-primary" />
          Categories
          {categoriesCount > 0 && (
            <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
              {categoriesCount}
            </span>
          )}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your expense categories
        </p>
      </div>
      {selectedCount > 0 && (
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {selectedCount} selected
        </span>
      )}
    </div>
  );
}

/* ─────────────────────── Categories Content ────────────────────────── */

function CategoriesContent({
  isPending,
  error,
  categoriesCount,
  data,
  totalCategories,
  selectAllCheckboxRef,
  isAllSelected,
  isPartiallySelected,
  handleToggleSelectAll,
  selectedCount,
  hasAnySelected,
  handleSelectAll,
  handleDeselectAll,
  selectedCategories,
  handleCheckboxChange,
  shouldRenderDeleteButton,
  handleDeleteClick,
  isMobile = false,
}: {
  isPending: boolean;
  error: Error | null;
  categoriesCount: number;
  data: any;
  totalCategories: number;
  selectAllCheckboxRef: React.RefObject<HTMLButtonElement | null>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  handleToggleSelectAll: (checked: boolean | "indeterminate") => void;
  selectedCount: number;
  hasAnySelected: boolean;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  selectedCategories: string[];
  handleCheckboxChange: (id: string, checked: boolean) => void;
  shouldRenderDeleteButton: boolean;
  handleDeleteClick: () => void;
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
        <p className="text-xs text-muted-foreground mt-1 max-w-md">
          {error?.message}
        </p>
      </div>
    );
  }

  if (categoriesCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center px-6">
        <div className="rounded-full bg-muted/60 p-4 mb-4">
          <FolderOpen className="size-6 text-muted-foreground/60" />
        </div>
        <p className="text-muted-foreground font-medium">No categories found</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Create your first category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Select-all toolbar */}
      {totalCategories > 0 && (
        <div
          className={cn(
            "flex items-center justify-between gap-2 p-2.5 rounded-xl",
            "bg-muted/40 border border-border/50",
            isMobile && "mx-0"
          )}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative shrink-0">
              <Checkbox
                id={isMobile ? "select-all-mobile" : "select-all"}
                ref={!isMobile ? selectAllCheckboxRef : undefined}
                checked={isAllSelected || isPartiallySelected}
                onCheckedChange={handleToggleSelectAll}
              />
            </div>
            <label
              htmlFor={isMobile ? "select-all-mobile" : "select-all"}
              className="cursor-pointer text-xs font-medium text-muted-foreground truncate"
            >
              {isAllSelected
                ? "All selected"
                : isPartiallySelected
                  ? `${selectedCount} of ${totalCategories}`
                  : `Select all (${totalCategories})`}
            </label>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {hasAnySelected && (
              <Badge
                variant="secondary"
                className={cn(
                  isAllSelected
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                )}
              >
                {selectedCount}/{totalCategories}
              </Badge>
            )}
            {isPartiallySelected && (
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleSelectAll}
                >
                  <CheckCheck className="size-3 mr-0.5" />
                  All
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDeselectAll}
                >
                  <Minus className="size-3 mr-0.5" />
                  None
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category list */}
      <ScrollArea
        className={cn(
          "w-full rounded-xl",
          isMobile ? "h-[50vh]" : "h-87.5 border bg-background/50"
        )}
      >
        <div className={cn("space-y-0.5", !isMobile && "p-2")}>
          {data.data.map((category: any, index: number) => (
            <div key={category.id}>
              <div
                className={cn(
                  "flex items-center gap-2.5 rounded-xl p-2.5",
                  "transition-colors duration-150",
                  "hover:bg-accent/50 active:bg-accent/70",
                  selectedCategories.includes(category.id) &&
                    "bg-primary/5 hover:bg-primary/8"
                )}
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(category.id, !!checked)
                  }
                  className="shrink-0"
                />
                <label
                  htmlFor={category.id}
                  className="cursor-pointer flex-1 min-w-0"
                >
                  <CategoryItem category={category} />
                </label>
              </div>
              {index < data.data.length - 1 && !isMobile && (
                <Separator className="my-0.5 opacity-30" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Delete bar */}
      {shouldRenderDeleteButton && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 pt-3",
            !isMobile && "border-t"
          )}
        >
          <p className="text-xs text-muted-foreground">
            {selectedCount > 0
              ? `${selectedCount} ${selectedCount === 1 ? "category" : "categories"} selected`
              : "No categories selected"}
          </p>
          <Button
            type="button"
            variant="destructive"
            disabled={selectedCategories.length === 0}
            onClick={handleDeleteClick}
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <Trash2 className="size-3.5" />
            Delete
            {selectedCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-0.5 bg-destructive-foreground text-destructive text-[10px] px-1 py-0"
              >
                {selectedCount}
              </Badge>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Delete Dialog ───────────────────────────── */

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
  categories: any[] | undefined;
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
          <AlertDialogDescription className="space-y-2" asChild>
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
                <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                  <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-1">
                    <Trash2 className="h-3 w-3" />
                    Categories to be deleted:
                  </p>
                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {categories
                        ?.filter((cat) => selectedCategories.includes(cat.id))
                        ?.slice(0, 8)
                        ?.map((cat) => (
                          <Badge
                            key={cat.id}
                            variant="destructive"
                            className="text-xs bg-destructive/10 text-destructive border-destructive/20"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                      {selectedCount > 8 && (
                        <Badge
                          variant="destructive"
                          className="text-xs bg-destructive/10 text-destructive border-destructive/20"
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
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
