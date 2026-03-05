"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { deleteTransactionsByIdServer } from "~/lib/api/transaction/delete-transactions-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionWithUser } from "~/types/TransactionWithUser";

import { Columns } from "./Columns";
import { DataTableContent } from "./DataTableContent";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

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
  });

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
        deleteTransactionsStatus={deleteTransactionsByIdMutation.status}
        onDeleteRows={handleDeleteRows}
      />
      <DataTableContent table={table} getColumnClassName={getColumnClassName} />
      <DataTablePagination table={table} />
    </div>
  );
}
