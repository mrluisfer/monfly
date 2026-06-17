import { ColumnDef } from "@tanstack/react-table";
import { format, isToday, isYesterday } from "date-fns";
import {
  ArrowUpDownIcon,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  TagIcon,
} from "lucide-react";
import { getCategoryIconByName } from "@/constants/categories/categories-icon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import {
  maskCurrency,
  type SupportedCurrency,
} from "~/utils/format-currency";

import { CardBadge, type CardSummary } from "../CardBadge";
import { LoanBadge } from "../LoanBadge";
import { RelativeTime } from "../RelativeTime";
import { TransactionActionsCell } from "./TransactionActionsCell";

// Lets the table pass per-render context (preferred currency, the user's cards,
// each category's chosen icon) down to cell renderers without prop-drilling
// through TanStack Table.
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    currency?: SupportedCurrency;
    cardsById?: Map<string, CardSummary>;
    /** Lowercased category name → the icon name the user picked for it. */
    categoryIconsByName?: Map<string, string>;
    /** When true, monetary figures are masked (the "hide balances" toggle). */
    hideBalance?: boolean;
  }
}

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
    cell: ({ row, table }) => {
      const description = row.getValue("description") as string;
      const transaction = row.original;
      const isLoanOrigin = (transaction.loanCount ?? 0) > 0;
      const isLoanPayment = Boolean(transaction.appliedToLoanId);
      const isLoan = isLoanOrigin || isLoanPayment;
      const card = transaction.cardId
        ? table.options.meta?.cardsById?.get(transaction.cardId)
        : undefined;

      return (
        <div className="flex max-w-[340px] flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-foreground leading-5 font-medium break-words whitespace-normal capitalize">
              {description || "No description"}
            </div>
            {isLoan && <LoanBadge isPayment={isLoanPayment} />}
          </div>
          {/* Keep this row light — the Activity column already carries the
              timestamps, so here we only surface which card it belongs to. */}
          {card ? <CardBadge card={card} /> : null}
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDownIcon />
          </Button>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const category = row.getValue("category") as string;
      // Mirror the icon the user assigned to this category in the Categories
      // view; fall back to a generic tag when the name doesn't resolve to one.
      const iconName = table.options.meta?.categoryIconsByName?.get(
        category.trim().toLowerCase(),
      );

      return (
        <div className="flex justify-center">
          <Badge
            variant="secondary"
            className="border-border/60 text-foreground max-w-[170px] gap-1.5 border px-2.5 font-medium capitalize"
          >
            {iconName ? (
              getCategoryIconByName(iconName, {
                className: "text-primary",
                "aria-hidden": true,
              })
            ) : (
              <TagIcon className="text-primary" aria-hidden="true" />
            )}
            <span className="min-w-0 truncate">{category}</span>
          </Badge>
        </div>
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
    cell: ({ row, table }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = String(row.getValue("type") || "").toLowerCase();
      const isIncome = type === "income";
      const formatted = maskCurrency(
        amount,
        table.options.meta?.currency ?? "USD",
        table.options.meta?.hideBalance,
      );

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
          <RelativeTime
            date={createdAt}
            className="text-foreground block text-sm font-medium"
          />
          {wasEdited ? (
            <RelativeTime
              date={updatedAt}
              prefix="Updated"
              className="text-muted-foreground inline-flex items-center gap-1 text-xs"
            />
          ) : (
            <div className="text-muted-foreground text-xs">Not edited</div>
          )}
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
