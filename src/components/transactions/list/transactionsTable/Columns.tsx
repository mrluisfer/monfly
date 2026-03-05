import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import {
  ArrowUpDownIcon,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
} from "lucide-react";

import { TransactionActionsCell } from "./TransactionActionsCell";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
        <div
          className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
            isIncome
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {isIncome ? <BanknoteArrowUpIcon /> : <BanknoteArrowDownIcon />}
        </div>
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
          Description
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[280px] whitespace-normal break-words leading-5">
          {description || "No description"}
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
        <div className="max-w-[160px] truncate capitalize">{category}</div>
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
      const date = row.getValue("date") as Date;
      return (
        <div className="text-muted-foreground text-sm">
          {new Date(date).toLocaleDateString()}
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
        <div
          className={`text-right font-medium ${
            isIncome
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatted}
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
