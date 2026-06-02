import { useMemo } from "react";
import type { Category } from "@prisma/client";
import { CheckCheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type SelectionBarProps = {
  filteredCategories: Category[];
  isFiltering: boolean;
  selectedSet: Set<string>;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleSelectCategories: (ids: string[]) => void;
  handleDeselectCategories: (ids: string[]) => void;
  totalCategories: number;
  selectedCount: number;
};

export const SelectionBar = ({
  filteredCategories,
  isFiltering,
  selectedSet,
  handleSelectAll,
  handleDeselectAll,
  handleSelectCategories,
  handleDeselectCategories,
  totalCategories,
  selectedCount,
}: SelectionBarProps) => {
  const filteredCategoryIds = useMemo(
    () => filteredCategories.map((c) => c.id),
    [filteredCategories],
  );
  const selectedFilteredCount = useMemo(
    () => filteredCategoryIds.filter((id) => selectedSet.has(id)).length,
    [filteredCategoryIds, selectedSet],
  );

  const total = isFiltering ? filteredCategories.length : totalCategories;
  const selected = isFiltering ? selectedFilteredCount : selectedCount;
  const isAllSelected = total > 0 && selected === total;
  const isPartial = selected > 0 && selected < total;
  const hasAny = selected > 0;

  if (total === 0) return null;

  const toggleAll = () => {
    if (isAllSelected) {
      if (isFiltering) handleDeselectCategories(filteredCategoryIds);
      else handleDeselectAll();
    } else {
      if (isFiltering) handleSelectCategories(filteredCategoryIds);
      else handleSelectAll();
    }
  };

  const clearSelection = () => {
    if (isFiltering) handleDeselectCategories(filteredCategoryIds);
    else handleDeselectAll();
  };

  return (
    <div
      className={cn(
        "bg-card flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 transition-colors",
        hasAny
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-border/60 bg-muted/30",
      )}
    >
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="select-all-categories"
          checked={isAllSelected}
          indeterminate={isPartial}
          onCheckedChange={toggleAll}
          aria-label={
            isAllSelected ? "Deselect all categories" : "Select all categories"
          }
        />
        <label
          htmlFor="select-all-categories"
          className="cursor-pointer text-sm font-medium select-none"
        >
          {hasAny ? (
            <span className="text-foreground">
              <span className="tabular-nums">{selected}</span>
              <span className="text-muted-foreground"> of </span>
              <span className="tabular-nums">{total}</span>
              <span className="text-muted-foreground"> selected</span>
            </span>
          ) : (
            <span className="text-muted-foreground">
              Select all{" "}
              <span className="text-foreground tabular-nums">({total})</span>
            </span>
          )}
        </label>
      </div>

      <div className="flex items-center gap-1.5">
        {!isAllSelected && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleAll}
            className="h-8 gap-1.5 px-3 text-xs"
          >
            <CheckCheckIcon className="size-3.5" aria-hidden="true" />
            Select all
          </Button>
        )}
        {hasAny && (
          <Button
            type="button"
            variant="outline"
            onClick={clearSelection}
            className="h-8 gap-1.5 px-3 text-xs"
          >
            <XIcon className="size-3.5" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
