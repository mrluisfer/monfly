import { useMemo } from "react";
import { Category } from "@prisma/client";
import { CheckCheckIcon, MinusIcon } from "lucide-react";

import { useCategoriesList } from "@/hooks/useCategoriesList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const SelectionBar = ({
  filteredCategories,
  isFiltering,
  selectedSet,
}: {
  filteredCategories: Category[];
  isFiltering: boolean;
  selectedSet: Set<string>;
}) => {
  const {
    handleSelectAll,
    handleDeselectAll,
    handleSelectCategories,
    handleDeselectCategories,
    totalCategories,
    selectedCount,
  } = useCategoriesList();

  const filteredCategoryIds = useMemo(
    () => filteredCategories.map((c) => c.id),
    [filteredCategories]
  );
  const selectedFilteredCount = useMemo(
    () => filteredCategoryIds.filter((id) => selectedSet.has(id)).length,
    [filteredCategoryIds, selectedSet]
  );

  const handleToolbarToggle = () => {
    if (toolbarIsAllSelected) {
      if (isFiltering) handleDeselectCategories(filteredCategoryIds);
      else handleDeselectAll();
    } else {
      if (isFiltering) handleSelectCategories(filteredCategoryIds);
      else handleSelectAll();
    }
  };

  const toolbarTotal = isFiltering
    ? filteredCategories.length
    : totalCategories;
  const toolbarSelected = isFiltering ? selectedFilteredCount : selectedCount;
  const toolbarIsAllSelected =
    toolbarTotal > 0 && toolbarSelected === toolbarTotal;
  const toolbarIsPartiallySelected =
    toolbarSelected > 0 && toolbarSelected < toolbarTotal;
  const toolbarHasAnySelected = toolbarSelected > 0;

  return (
    <>
      {toolbarTotal > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-4xl border border-border/60 bg-muted/30 px-3.5 py-2">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="select-all-categories"
              checked={toolbarIsAllSelected}
              indeterminate={toolbarIsPartiallySelected}
              onCheckedChange={handleToolbarToggle}
            />
            <label
              htmlFor="select-all-categories"
              className="cursor-pointer font-medium text-muted-foreground"
            >
              {toolbarIsAllSelected
                ? "All selected"
                : toolbarIsPartiallySelected
                  ? `${toolbarSelected} of ${toolbarTotal} selected`
                  : `Select all (${toolbarTotal})`}
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            {toolbarHasAnySelected && <Badge>{toolbarSelected}</Badge>}
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => {
                if (toolbarIsAllSelected) {
                  if (isFiltering)
                    handleDeselectCategories(filteredCategoryIds);
                  else handleDeselectAll();
                } else {
                  if (isFiltering) handleSelectCategories(filteredCategoryIds);
                  else handleSelectAll();
                }
              }}
              disabled={toolbarIsAllSelected}
              aria-label="Select all"
            >
              <CheckCheckIcon className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => {
                if (isFiltering) handleDeselectCategories(filteredCategoryIds);
                else handleDeselectAll();
              }}
              disabled={!toolbarHasAnySelected}
              aria-label="Deselect all"
            >
              <MinusIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
