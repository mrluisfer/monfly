import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import TransactionItemActions from "./transaction-item-actions";

type TransactionCardListProps = {
  data: Transaction[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TransactionCardList({ data }: TransactionCardListProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 pb-2 sm:gap-4">
      {data.map((transaction, index) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          index={index}
        />
      ))}
    </div>
  );
}

function TransactionCard({
  transaction,
  index,
}: {
  transaction: Transaction;
  index: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const category =
    typeof transaction.category === "string"
      ? transaction.category
      : (transaction.category as any)?.name || "Uncategorized";
  const amountPrefix = transaction.type === "INCOME" ? "+" : "-";
  const transactionTypeLabel =
    transaction.type === "INCOME" ? "Income" : "Expense";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.18) }}
        className="rounded-xl border bg-card p-3 shadow-sm sm:p-4"
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm",
                transaction.type === "INCOME"
                  ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                  : "text-red-600 bg-red-100 dark:bg-red-900/30"
              )}
            >
              {transaction.type === "INCOME" ? (
                <ArrowUpIcon className="h-5 w-5" />
              ) : (
                <ArrowDownIcon className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 break-words text-sm font-medium sm:text-base">
                {transaction.description || "No description"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "px-2 py-0.5 text-[10px]",
                    transaction.type === "INCOME"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  )}
                >
                  {transactionTypeLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className="max-w-[180px] truncate px-2 py-0.5 text-[10px]"
                >
                  {category}
                </Badge>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
            <span
              className={cn(
                "text-sm font-bold sm:text-base",
                transaction.type === "INCOME"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {amountPrefix}
              {currencyFormatter.format(transaction.amount)}
            </span>
            <TransactionItemActions
              // @ts-ignore - Transaction type vs TransactionWithUser type mismatch.
              transaction={transaction as any}
              setIsOpenDialog={setIsDialogOpen}
            />
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}
