import type { ColumnDef } from "@tanstack/react-table";
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
import type { TransactionWithUser } from "~/types/TransactionWithUser";
import { getTransactionTitle } from "~/utils/transaction-title";
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
    cardsById?: Map<string, CardSummary>;
    /** Lowercased category name → the icon name the user picked for it. */
    categoryIconsByName?: Map<string, string>;
    /** Currency formatter from `useCurrency`, already honoring "hide balances". */
    formatAmount?: (amount: number) => string;
  }
}

function formatRelativeTransactionDay(date: Date) {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "EEE");
}

export const Columns: ColumnDef<TransactionWithUser>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableHiding: false,
    enableSorting: false,
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
    id: "select",
  },
  {
    accessorKey: "type",
    cell: ({ row }) => {
      const type = String(row.getValue("type") || "").toLowerCase();
      const isIncome = type === "income";

      return (
        <Badge
          variant="outline"
          className={
            isIncome
              ? "gap-1.5 border-primary/25 bg-primary/10 text-primary"
              : "gap-1.5 border-destructive/25 bg-destructive/10 text-destructive"
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
      const cellValue = row.getValue(id) as string | undefined;
      return cellValue?.toLowerCase().includes(value.toLowerCase()) ?? false;
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDownIcon />
      </Button>
    ),
  },
  {
    accessorKey: "description",
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
            <div className="whitespace-normal break-words font-medium text-foreground capitalize leading-5">
              {getTransactionTitle(description, transaction.category)}
            </div>
            {isLoan ? <LoanBadge isPayment={isLoanPayment} /> : null}
          </div>
          {/* Keep this row light — the Activity column already carries the
              timestamps, so here we only surface which card it belongs to. */}
          {card ? <CardBadge card={card} /> : null}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id) as string | undefined;
      return cellValue?.toLowerCase().includes(value.toLowerCase()) ?? false;
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Details
        <ArrowUpDownIcon />
      </Button>
    ),
  },
  {
    accessorKey: "category",
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
            className="max-w-[170px] gap-1.5 border border-border/60 px-2.5 font-medium text-foreground capitalize"
          >
            {iconName ? (
              getCategoryIconByName(iconName, {
                "aria-hidden": true,
                className: "text-primary",
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
      const cellValue = row.getValue(id) as string | undefined;
      return cellValue?.toLowerCase().includes(value.toLowerCase()) ?? false;
    },
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDownIcon />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    cell: ({ row, table }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const type = String(row.getValue("type") || "").toLowerCase();
      const isIncome = type === "income";
      const formatted = table.options.meta?.formatAmount?.(amount) ?? "";

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
  },
  {
    accessorKey: "date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as Date);
      return (
        <div className="space-y-0.5">
          <div className="font-medium text-foreground text-sm">
            {format(date, "MMM d, yyyy")}
          </div>
          <div className="text-muted-foreground text-xs">
            {formatRelativeTransactionDay(date)} • {format(date, "p")}
          </div>
        </div>
      );
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDownIcon />
      </Button>
    ),
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      const updatedAt = new Date(row.original.updatedAt);
      const wasEdited = updatedAt.getTime() - createdAt.getTime() > 60_000;

      return (
        <div className="space-y-0.5">
          <RelativeTime
            date={createdAt}
            className="block font-medium text-foreground text-sm"
          />
          {wasEdited ? (
            <RelativeTime
              date={updatedAt}
              prefix="Updated"
              className="inline-flex items-center gap-1 text-muted-foreground text-xs"
            />
          ) : (
            <div className="text-muted-foreground text-xs">Not edited</div>
          )}
        </div>
      );
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Activity
        <ArrowUpDownIcon />
      </Button>
    ),
  },
  {
    cell: ({ row, table }) => (
      <TransactionActionsCell
        transaction={row.original}
        disabled={table.getSelectedRowModel().rows.length > 1}
      />
    ),
    enableHiding: false,
    id: "actions",
  },
];
