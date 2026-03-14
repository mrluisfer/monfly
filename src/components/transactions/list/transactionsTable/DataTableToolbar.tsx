import * as React from "react";
import { Table as TanstackTable } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import {
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  ChevronDown,
  CircleAlertIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";

interface DataTableToolbarProps {
  table: TanstackTable<TransactionWithUser>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  typeFilterValue: string;
  hasActiveFilters: boolean;
  selectedRowsCount: number;
  deleteTransactionsStatus: "idle" | "pending" | "success" | "error";
  onDeleteRows: () => void;
}

export function DataTableToolbar({
  table,
  globalFilter,
  setGlobalFilter,
  typeFilterValue,
  hasActiveFilters,
  selectedRowsCount,
  deleteTransactionsStatus,
  onDeleteRows,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center">
      <Input
        placeholder="Search transactions..."
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="h-11 rounded-full border-border/70 bg-background/70 px-4 xl:max-w-sm"
      />
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="lg"
            variant={typeFilterValue === "income" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => {
              const column = table.getColumn("type");
              const currentFilter = column?.getFilterValue();
              column?.setFilterValue(
                String(currentFilter).toLowerCase() === "income" ? "" : "income"
              );
            }}
            aria-label="Filter income transactions"
          >
            <BanknoteArrowUpIcon className="size-4" />
            <span className="hidden sm:inline">Income</span>
          </Button>
          <Button
            size="lg"
            variant={typeFilterValue === "expense" ? "destructive" : "outline"}
            className="rounded-full"
            onClick={() => {
              const column = table.getColumn("type");
              const currentFilter = column?.getFilterValue();
              column?.setFilterValue(
                String(currentFilter).toLowerCase() === "expense"
                  ? ""
                  : "expense"
              );
            }}
            aria-label="Filter expense transactions"
          >
            <BanknoteArrowDownIcon className="size-4" />
            <span className="hidden sm:inline">Expense</span>
          </Button>
          {hasActiveFilters && (
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                setGlobalFilter("");
                table.resetColumnFilters();
              }}
            >
              <XIcon className="size-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {selectedRowsCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button size="lg" variant="destructive" className="rounded-full">
                    <TrashIcon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Delete
                    <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {selectedRowsCount}
                    </span>
                  </Button>
                }
              />
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {selectedRowsCount} selected{" "}
                      {selectedRowsCount === 1 ? "row" : "rows"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteRows}
                    disabled={deleteTransactionsStatus === "pending"}
                    variant="destructive"
                  >
                    {deleteTransactionsStatus === "pending"
                      ? "Deleting..."
                      : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="lg" variant="outline" className="rounded-full">
                  Columns <ChevronDown className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
