import type { Category } from "@prisma/client";
import { Grid2X2Icon, LayoutListIcon, SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { SelectionBar } from "./SelectionBar";

type ViewMode = "grid" | "list";

type CategoryToolbarProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isFiltering: boolean;
  filteredCategories: Category[];
  categoriesCount: number;
  selectedSet: Set<string>;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleSelectCategories: (ids: string[]) => void;
  handleDeselectCategories: (ids: string[]) => void;
  totalCategories: number;
  selectedCount: number;
};

export const CategoryToolbar = ({
  searchValue,
  setSearchValue,
  viewMode,
  setViewMode,
  isFiltering,
  filteredCategories,
  categoriesCount,
  selectedSet,
  handleSelectAll,
  handleDeselectAll,
  handleSelectCategories,
  handleDeselectCategories,
  totalCategories,
  selectedCount,
}: CategoryToolbarProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <InputGroup className="h-10 sm:max-w-sm">
          <InputGroupAddon>
            <SearchIcon className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search categories…"
            aria-label="Search categories"
          />
          {isFiltering && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                onClick={() => setSearchValue("")}
                aria-label="Clear search"
              >
                <XIcon aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="flex items-center gap-3">
          {/* Result count */}
          <span
            className={cn(
              "text-muted-foreground tabular-nums text-xs",
              !isFiltering && "hidden"
            )}
            aria-live="polite"
          >
            {filteredCategories.length} of {categoriesCount}
          </span>

          {/* View toggle */}
          <ToggleGroup
            value={[viewMode]}
            onValueChange={(values) => {
              const next = values[0] as ViewMode | undefined;
              if (next) setViewMode(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Toggle view mode"
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <ToggleGroupItem
                    value="grid"
                    aria-label="Grid view"
                    className="px-3"
                  />
                }
              >
                <Grid2X2Icon className="size-4" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Grid view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <ToggleGroupItem
                    value="list"
                    aria-label="List view"
                    className="px-3"
                  />
                }
              >
                <LayoutListIcon className="size-4" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>List view</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </div>

      <SelectionBar
        isFiltering={isFiltering}
        filteredCategories={filteredCategories}
        selectedSet={selectedSet}
        handleSelectAll={handleSelectAll}
        handleDeselectAll={handleDeselectAll}
        handleSelectCategories={handleSelectCategories}
        handleDeselectCategories={handleDeselectCategories}
        totalCategories={totalCategories}
        selectedCount={selectedCount}
      />
    </div>
  );
};
