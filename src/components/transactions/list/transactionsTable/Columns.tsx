import { ColumnDef } from "@tanstack/react-table";
import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
} from "date-fns";
import {
  ArrowUpDownIcon,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  HandCoinsIcon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TransactionWithUser } from "~/types/TransactionWithUser";

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
              ? "border-primary/25 bg-primary/10 text-primary gap-1.5"
              : "border-destructive/25 bg-destructive/10 text-destructive gap-1.5"
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
      const isLoanOrigin = (transaction.loanCount ?? 0) > 0;
      const isLoanPayment = Boolean(transaction.appliedToLoanId);
      const isLoan = isLoanOrigin || isLoanPayment;

      return (
        <div className="max-w-[340px] space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-foreground leading-5 font-medium break-words whitespace-normal capitalize">
              {description || "No description"}
            </div>
            {isLoan && (
              <span
                className="border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                title={
                  isLoanPayment
                    ? "This transaction was applied as a payment to a loan"
                    : "This transaction is tracked as a loan"
                }
              >
                <HandCoinsIcon className="size-3" aria-hidden="true" />
                {isLoanPayment ? "Loan payment" : "Loan"}
              </span>
            )}
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <span>
              Recorded{" "}
              {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
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
        <Badge variant="default" className="max-w-[160px] truncate capitalize">
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
              isIncome ? "text-primary" : "text-destructive"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatted}
          </div>
          <div className="text-muted-foreground text-xs">
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
          <div className="text-foreground text-sm font-medium">
            {format(date, "MMM d, yyyy")}
          </div>
          <div className="text-muted-foreground text-xs">
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
          <div className="text-foreground text-sm font-medium">
            {formatDistanceToNowStrict(createdAt, { addSuffix: true })}
          </div>
          <div className="text-muted-foreground text-xs">
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TransactionActionsCell transaction={row.original} />,
  },
];
