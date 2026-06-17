"use client";

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
import { format } from "date-fns";
import { useAtomValue } from "jotai";
import * as React from "react";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { deleteTransactionsByIdServer } from "~/lib/api/transaction/delete-transactions-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { maskCurrency } from "~/utils/format-currency";

import { CardSummary } from "../CardBadge";
import { Columns } from "./Columns";
import { DataTableContent } from "./DataTableContent";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableDemoProps {
  data: TransactionWithUser[];
  cardsById?: Map<string, CardSummary>;
  categoryIconsByName?: Map<string, string>;
}

export function DataTableDemo({
  data,
  cardsById,
  categoryIconsByName,
}: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const userEmail = useRouteUser();
  const currency = usePreferredCurrency();
  const hideBalance = useAtomValue(hideBalanceAtom);
  const queryClient = useQueryClient();

  // TanStack Table returns functions the React Compiler can't safely memoize;
  // this is a known library limitation, not a correctness issue here.
  // eslint-disable-next-line react-hooks/incompatible-library
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
        field.toLowerCase().includes(search),
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: { currency, cardsById, categoryIconsByName, hideBalance },
  });

  const deleteTransactionsByIdMutation = useMutation({
    fn: deleteTransactionsByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
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
      label: "Results",
      value: String(filteredTransactions.length),
      description: "Visible rows in current view",
    },
    {
      label: "Income",
      value: maskCurrency(filteredIncome, currency, hideBalance),
      valueClassName: "text-primary",
      description: "Sum of visible income rows",
    },
    {
      label: "Expenses",
      value: maskCurrency(filteredExpenses, currency, hideBalance),
      valueClassName: "text-destructive",
      description: "Sum of visible expense rows",
    },
    {
      label: "Net",
      value: `${filteredNet >= 0 ? "+" : ""}${maskCurrency(filteredNet, currency, hideBalance)}`,
      valueClassName: filteredNet >= 0 ? "text-primary" : "text-destructive",
      description: latestTransactionDate
        ? `Latest: ${format(new Date(latestTransactionDate), "MMM d, yyyy")}`
        : "No visible transactions",
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
          <div key={stat.label} className="bg-muted rounded-xl px-5 py-3">
            <div className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
              {stat.label}
            </div>
            <div
              className={cn(
                "text-foreground mt-2 text-lg font-semibold",
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
