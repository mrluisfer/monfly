"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useCurrency } from "~/hooks/useCurrency";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { deleteTransactionsByIdServer } from "~/lib/api/transaction/delete-transactions-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import type { TransactionWithUser } from "~/types/TransactionWithUser";

import type { CardSummary } from "../CardBadge";
import { Columns } from "./Columns";
import { DataTableContent } from "./DataTableContent";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableDemoProps {
  cardsById?: Map<string, CardSummary>;
  categoryIconsByName?: Map<string, string>;
  data: TransactionWithUser[];
}

export function DataTableDemo({
  data,
  cardsById,
  categoryIconsByName,
}: DataTableDemoProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const userEmail = useRouteUser();
  const { format: formatAmount } = useCurrency();
  const queryClient = useQueryClient();

  // TanStack Table returns functions the React Compiler can't safely memoize;
  // this is a known library limitation, not a correctness issue here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: Columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, value) => {
      const search = String(value).toLowerCase().trim();
      if (!search) {
        return true;
      }

      const searchableFields = [
        (row.getValue("description") as string) || "",
        (row.getValue("category") as string) || "",
        (row.getValue("type") as string) || "",
        (row.getValue("amount") as number | undefined)?.toString() || "",
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(search),
      );
    },
    meta: { cardsById, categoryIconsByName, formatAmount },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
      sorting,
    },
  });

  const deleteTransactionsByIdMutation = useMutation({
    fn: deleteTransactionsByIdServer,
    idempotency: {
      getKey: (variables) =>
        JSON.stringify(
          [...variables.data.ids].sort((left, right) =>
            left.localeCompare(right),
          ),
        ),
      onDuplicatePending: {
        title: "Deletion already in progress",
      },
      onDuplicateRecentSuccess: {
        title: "Transactions already deleted",
      },
    },
    onSuccess: async ({ data: result }) => {
      if (isErrorPayload(result)) {
        const response = result as { message?: string };
        sileo.error({
          title: response.message ?? "Failed to delete transactions",
        });
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
  });

  useEffect(() => {
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
    table.getColumn("type")?.getFilterValue() ?? "",
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
    0,
  );
  const filteredExpenses = filteredTransactions.reduce(
    (sum, transaction) =>
      transaction.type.toLowerCase() === "expense"
        ? sum + transaction.amount
        : sum,
    0,
  );
  const filteredNet = filteredIncome - filteredExpenses;
  const latestTransactionDate = filteredTransactions.length
    ? filteredTransactions.reduce((latest, transaction) =>
        new Date(transaction.date).getTime() > new Date(latest.date).getTime()
          ? transaction
          : latest,
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
      columnId === "actions" && "w-14 min-w-14",
    );

  const stats = [
    {
      description: "Visible rows in current view",
      label: "Results",
      value: String(filteredTransactions.length),
    },
    {
      description: "Sum of visible income rows",
      label: "Income",
      value: formatAmount(filteredIncome),
      valueClassName: "text-primary",
    },
    {
      description: "Sum of visible expense rows",
      label: "Expenses",
      value: formatAmount(filteredExpenses),
      valueClassName: "text-destructive",
    },
    {
      description: latestTransactionDate
        ? `Latest: ${format(new Date(latestTransactionDate), "MMM d, yyyy")}`
        : "No visible transactions",
      label: "Net",
      value: `${filteredNet >= 0 ? "+" : ""}${formatAmount(filteredNet)}`,
      valueClassName: filteredNet >= 0 ? "text-primary" : "text-destructive",
    },
  ] as const;

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
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-muted px-5 py-3">
            <div className="font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
              {stat.label}
            </div>
            <div
              className={cn(
                "mt-2 font-semibold text-foreground text-lg",
                "valueClassName" in stat && stat.valueClassName,
              )}
            >
              {stat.value}
            </div>
            <div className="text-muted-foreground text-xs">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
      <DataTableContent table={table} getColumnClassName={getColumnClassName} />
      <DataTablePagination table={table} />
    </div>
  );
}
