"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table as TanstackTable,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
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
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { deleteTransactionsByIdServer } from "~/lib/api/transaction/delete-transactions-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import {
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  ChevronDown,
  CircleAlertIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Columns } from "./Columns";

interface DataTableDemoProps {
  data: TransactionWithUser[];
}

interface TableToolbarProps {
  table: TanstackTable<TransactionWithUser>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  typeFilterValue: string;
  hasActiveFilters: boolean;
  selectedRowsCount: number;
  deleteTransactionsByIdMutation: {
    status: "idle" | "pending" | "success" | "error";
  };
  handleDeleteRows: () => void;
}

function DataTableToolbar({
  table,
  globalFilter,
  setGlobalFilter,
  typeFilterValue,
  hasActiveFilters,
  selectedRowsCount,
  deleteTransactionsByIdMutation,
  handleDeleteRows,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center">
      <Input
        placeholder="Search transactions..."
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="w-full xl:max-w-sm"
      />
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={typeFilterValue === "income" ? "default" : "outline"}
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
            size="sm"
            variant={typeFilterValue === "expense" ? "destructive" : "outline"}
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
              size="sm"
              variant="secondary"
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
                  <Button size="sm" variant="destructive">
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
                    onClick={handleDeleteRows}
                    disabled={
                      deleteTransactionsByIdMutation.status === "pending"
                    }
                    variant="destructive"
                  >
                    {deleteTransactionsByIdMutation.status === "pending"
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
                <Button size="sm" variant="outline">
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

function DataTableContent({
  table,
  getColumnClassName,
}: {
  table: TanstackTable<TransactionWithUser>;
  getColumnClassName: (columnId: string) => string;
}) {
  return (
    <div className="rounded-md border">
      <Table className="min-w-[760px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={getColumnClassName(header.column.id)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={getColumnClassName(cell.column.id)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function DataTablePagination({
  table,
}: {
  table: TanstackTable<TransactionWithUser>;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-muted-foreground text-xs">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function DataTableDemo({ data }: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const userEmail = useRouteUser();
  const queryClient = useQueryClient();

  const table = useReactTable({
    data,
    columns: Columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value) => {
      const search = String(value).toLowerCase().trim();
      if (!search) return true;

      // Search across multiple fields
      const searchableFields = [
        (row.getValue("description") as string) || "",
        (row.getValue("category") as string) || "",
        (row.getValue("type") as string) || "",
        (row.getValue("amount") as number)?.toString() || "",
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(search)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const deleteTransactionsByIdMutation = useMutation({
    fn: deleteTransactionsByIdServer,
    onSuccess: async () => {
      sileo.success({ title: "Transactions deleted successfully" });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.transactions, userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.user, userEmail],
      });
      table.resetRowSelection();
    },
  }); // Handle delete multiple transactions error
  React.useEffect(() => {
    if (
      deleteTransactionsByIdMutation.status === "error" &&
      deleteTransactionsByIdMutation.error
    ) {
      sileo.error({ title: "Failed to delete transactions" });
    }
  }, [
    deleteTransactionsByIdMutation.status,
    deleteTransactionsByIdMutation.error,
  ]);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    if (selectedIds.length === 0) {
      sileo.warning({ title: "No transactions selected" });
      return;
    }

    deleteTransactionsByIdMutation.mutate({
      data: {
        ids: selectedIds,
      },
    });
  };

  const selectedRowsCount = table.getSelectedRowModel().rows.length;
  const typeFilterValue = String(
    table.getColumn("type")?.getFilterValue() ?? ""
  ).toLowerCase();
  const hasActiveFilters =
    Boolean(globalFilter) || table.getState().columnFilters.length > 0;
  const getColumnClassName = (columnId: string) =>
    cn(
      columnId === "select" && "w-10 min-w-10",
      columnId === "type" && "w-14 min-w-14",
      columnId === "description" && "min-w-[220px]",
      columnId === "category" && "min-w-[140px]",
      columnId === "date" && "min-w-[130px]",
      columnId === "amount" && "min-w-[130px]",
      columnId === "actions" && "w-14 min-w-14"
    );

  return (
    <div className="w-full">
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        typeFilterValue={typeFilterValue}
        hasActiveFilters={hasActiveFilters}
        selectedRowsCount={selectedRowsCount}
        deleteTransactionsByIdMutation={deleteTransactionsByIdMutation}
        handleDeleteRows={handleDeleteRows}
      />
      <DataTableContent table={table} getColumnClassName={getColumnClassName} />
      <DataTablePagination table={table} />
    </div>
  );
}
