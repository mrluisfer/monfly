import { Category } from "@prisma/client";
import { Grid2X2Icon, LayoutListIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { SelectionBar } from "./SelectionBar";

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
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
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
}) => {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search categories..."
              className="h-10 rounded-4xl pl-9 pr-9"
            />
            {isFiltering && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter count */}
            {isFiltering && (
              <span className="text-xs text-muted-foreground">
                {filteredCategories.length} of {categoriesCount}
              </span>
            )}

            {/* View toggle */}
            <div className="flex items-center rounded-4xl border border-border bg-muted/50 p-0.5">
              <Button
                type="button"
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "default" : "ghost"}
                aria-label="Grid view"
                size={"icon-lg"}
              >
                <Grid2X2Icon className="size-4" />
              </Button>
              <Button
                type="button"
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "default" : "ghost"}
                aria-label="List view"
                size={"icon-lg"}
              >
                <LayoutListIcon className="size-4" />
              </Button>
            </div>
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
      </CardContent>
    </Card>
  );
};
