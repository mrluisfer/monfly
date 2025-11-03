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
import { deleteTransactionsByIdServer } from "~/lib/api/transaction/delete-transactions-by-id.server";
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
import { toast } from "sonner";

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

export function DataTableDemo({ data }: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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
    globalFilterFn: (row, columnId, value) => {
      const search = value.toLowerCase();

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
      toast.success("Transactions deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.transactions, userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.user, userEmail],
      });
      setIsDeleteDialogOpen(false);
      table.resetRowSelection();
    },
  }); // Handle delete multiple transactions error
  React.useEffect(() => {
    if (
      deleteTransactionsByIdMutation.status === "error" &&
      deleteTransactionsByIdMutation.error
    ) {
      toast.error("Failed to delete transactions");
      setIsDeleteDialogOpen(false);
    }
  }, [
    deleteTransactionsByIdMutation.status,
    deleteTransactionsByIdMutation.error,
  ]);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    if (selectedIds.length === 0) {
      toast.error("No transactions selected");
      return;
    }

    deleteTransactionsByIdMutation.mutate({
      data: {
        ids: selectedIds,
      },
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search transactions..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center justify-between gap-2 flex-1">
          <div className="flex items-center gap-2">
            <Button
              variant={
                table.getColumn("type")?.getFilterValue() === "income"
                  ? "default"
                  : "outline"
              }
              onClick={() => {
                const column = table.getColumn("type");
                const currentFilter = column?.getFilterValue();
                column?.setFilterValue(
                  currentFilter === "income" ? "" : "income"
                );
              }}
            >
              <BanknoteArrowUpIcon />
            </Button>
            <Button
              variant={
                table.getColumn("type")?.getFilterValue() === "expense"
                  ? "destructive"
                  : "outline"
              }
              onClick={() => {
                const column = table.getColumn("type");
                const currentFilter = column?.getFilterValue();
                column?.setFilterValue(
                  currentFilter === "expense" ? "" : "expense"
                );
              }}
            >
              <BanknoteArrowDownIcon />
            </Button>
            {(globalFilter || table.getState().columnFilters.length > 0) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setGlobalFilter("");
                  table.resetColumnFilters();
                }}
              >
                <XIcon />
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Delete button */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="ml-auto" variant="destructive">
                    <TrashIcon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Delete
                    <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
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
                        This action cannot be undone. This will permanently
                        delete {table.getSelectedRowModel().rows.length}{" "}
                        selected{" "}
                        {table.getSelectedRowModel().rows.length === 1
                          ? "row"
                          : "rows"}
                        .
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
                      asChild
                    >
                      <Button variant={"destructive"}>
                        {deleteTransactionsByIdMutation.status === "pending"
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
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
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  );
}
