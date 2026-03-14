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
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { deleteTransactionsByIdServer } from "~/lib/api/transaction/delete-transactions-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { formatCurrency } from "~/utils/format-currency";
import { format } from "date-fns";

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
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to delete transactions" });
        return;
      }

      sileo.success({ title: "Transactions deleted successfully" });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.transactions, userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.user, userEmail],
      });
      table.resetRowSelection();
    },
    idempotency: {
      getKey: (variables) =>
        JSON.stringify([...variables.data.ids].sort((left, right) =>
          left.localeCompare(right)
        )),
      onDuplicatePending: {
        title: "Deletion already in progress",
      },
      onDuplicateRecentSuccess: {
        title: "Transactions already deleted",
      },
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
  const filteredTransactions = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);
  const filteredIncome = filteredTransactions.reduce(
    (sum, transaction) =>
      transaction.type.toLowerCase() === "income"
        ? sum + transaction.amount
        : sum,
    0
  );
  const filteredExpenses = filteredTransactions.reduce(
    (sum, transaction) =>
      transaction.type.toLowerCase() === "expense"
        ? sum + transaction.amount
        : sum,
    0
  );
  const filteredNet = filteredIncome - filteredExpenses;
  const latestTransactionDate = filteredTransactions.length
    ? filteredTransactions.reduce((latest, transaction) =>
        new Date(transaction.date).getTime() > new Date(latest.date).getTime()
          ? transaction
          : latest
      ).date
    : null;
  const getColumnClassName = (columnId: string) =>
    cn(
      columnId === "select" && "w-10 min-w-10",
      columnId === "type" && "min-w-[120px]",
      columnId === "description" && "min-w-[280px]",
      columnId === "category" && "min-w-[150px]",
      columnId === "date" && "min-w-[160px]",
      columnId === "createdAt" && "min-w-[160px]",
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
      <div className="mb-4 grid gap-3 lg:grid-cols-4">
        <div className="finance-chip rounded-[1.1rem] p-3">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Results
          </div>
          <div className="mt-2 text-lg font-semibold text-foreground">
            {filteredTransactions.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Visible rows in current view
          </div>
        </div>
        <div className="finance-chip rounded-[1.1rem] p-3">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Income
          </div>
          <div className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(filteredIncome, "USD")}
          </div>
          <div className="text-xs text-muted-foreground">
            Sum of visible income rows
          </div>
        </div>
        <div className="finance-chip rounded-[1.1rem] p-3">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Expenses
          </div>
          <div className="mt-2 text-lg font-semibold text-rose-600 dark:text-rose-400">
            {formatCurrency(filteredExpenses, "USD")}
          </div>
          <div className="text-xs text-muted-foreground">
            Sum of visible expense rows
          </div>
        </div>
        <div className="finance-chip rounded-[1.1rem] p-3">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Net
          </div>
          <div
            className={cn(
              "mt-2 text-lg font-semibold",
              filteredNet >= 0
                ? "text-primary"
                : "text-amber-700 dark:text-amber-300"
            )}
          >
            {filteredNet >= 0 ? "+" : ""}
            {formatCurrency(filteredNet, "USD")}
          </div>
          <div className="text-xs text-muted-foreground">
            {latestTransactionDate
              ? `Latest: ${format(new Date(latestTransactionDate), "MMM d, yyyy")}`
              : "No visible transactions"}
          </div>
        </div>
      </div>
      <DataTableContent table={table} getColumnClassName={getColumnClassName} />
      <DataTablePagination table={table} />
    </div>
  );
}
