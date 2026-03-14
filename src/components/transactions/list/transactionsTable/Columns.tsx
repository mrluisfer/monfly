import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import {
  ArrowUpDownIcon,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
} from "lucide-react";
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";

import { TransactionActionsCell } from "./TransactionActionsCell";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatRelativeTransactionDay(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEE");
}

export const Columns: ColumnDef<TransactionWithUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = String(row.getValue("type") || "").toLowerCase();
      const isIncome = type === "income";

      return (
        <Badge
          variant="outline"
          className={
            isIncome
              ? "gap-1.5 border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "gap-1.5 border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300"
          }
        >
          {isIncome ? (
            <BanknoteArrowUpIcon className="size-3.5" />
          ) : (
            <BanknoteArrowDownIcon className="size-3.5" />
          )}
          {isIncome ? "Income" : "Expense"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as string;
      return cellValue?.toLowerCase().includes(value.toLowerCase()) ?? false;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Details
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      const transaction = row.original;
      const createdAt = new Date(transaction.createdAt);

      return (
        <div className="max-w-[340px] space-y-1">
          <div className="whitespace-normal break-words leading-5 font-medium text-foreground">
            {description || "No description"}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="capitalize">
              {transaction.category}
            </Badge>
            <span>
              Recorded {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as string;
      return cellValue?.toLowerCase().includes(value.toLowerCase()) ?? false;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant="outline" className="max-w-[160px] truncate capitalize">
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as string;
      return cellValue?.toLowerCase().includes(value.toLowerCase()) ?? false;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as Date);
      return (
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-foreground">
            {format(date, "MMM d, yyyy")}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatRelativeTransactionDay(date)} • {format(date, "p")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Activity
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const updatedAt = new Date(row.original.updatedAt);
      const wasEdited = updatedAt.getTime() - createdAt.getTime() > 60_000;

      return (
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-foreground">
            {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
          </div>
          <div className="text-xs text-muted-foreground">
            {wasEdited
              ? `Updated ${formatDistanceToNowStrict(updatedAt, {
                  addSuffix: true,
                })}`
              : "Not edited"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0"
        >
          Amount
          <ArrowUpDownIcon />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = String(row.getValue("type") || "").toLowerCase();
      const isIncome = type === "income";
      const formatted = currencyFormatter.format(amount);

      return (
        <div className="space-y-0.5 text-right">
          <div
            className={`font-semibold ${
              isIncome
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatted}
          </div>
          <div className="text-xs text-muted-foreground">
            {isIncome ? "Money in" : "Money out"}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const amount = row.getValue(id) as number;
      return amount.toString().includes(value);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TransactionActionsCell transaction={row.original} />,
  },
];
