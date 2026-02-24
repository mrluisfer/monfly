import { useState } from "react";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { format, isToday, isYesterday } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";

import TransactionItemActions from "./transaction-item-actions";

type TransactionCardListProps = {
  data: Transaction[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatRelativeDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

function groupTransactionsByDate(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const key = formatRelativeDate(new Date(tx.date));
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }
  return groups;
}

export function TransactionCardList({ data }: TransactionCardListProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="rounded-full bg-muted/60 p-4 mb-4">
          <ArrowDownLeftIcon className="size-6 text-muted-foreground/60" />
        </div>
        <p className="text-muted-foreground font-medium">No transactions yet</p>
        <p className="text-muted-foreground/60 text-sm mt-1">
          Your transactions will appear here
        </p>
      </div>
    );
  }

  const grouped = groupTransactionsByDate(data);

  return (
    <div className="space-y-5 pb-4">
      <AnimatePresence mode="popLayout">
        {Object.entries(grouped).map(([dateLabel, transactions], groupIdx) => (
          <motion.section
            key={dateLabel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: groupIdx * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2.5 px-1">
              <CalendarIcon className="size-3.5 text-muted-foreground/50" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {dateLabel}
              </h3>
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                {transactions.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {transactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                  groupDelay={groupIdx * 0.05}
                />
              ))}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  );
}

function TransactionRow({
  transaction,
  index,
  groupDelay,
}: {
  transaction: Transaction;
  index: number;
  groupDelay: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isIncome = transaction.type.toLowerCase() === "income";
  const category =
    typeof transaction.category === "string"
      ? transaction.category
      : (transaction.category as any)?.name || "Uncategorized";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.25,
          delay: groupDelay + Math.min(index * 0.04, 0.2),
          ease: "easeOut",
        }}
        className={cn(
          "group flex items-center gap-3 rounded-2xl px-3 py-3",
          "bg-background/60 hover:bg-muted/50",
          "transition-colors duration-200",
          "active:scale-[0.98] active:transition-transform active:duration-100"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            "transition-shadow duration-200",
            isIncome
              ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15"
              : "bg-red-500/10 text-red-500 dark:bg-red-500/15"
          )}
        >
          {isIncome ? (
            <ArrowUpRightIcon className="size-4.5" strokeWidth={2.2} />
          ) : (
            <ArrowDownLeftIcon className="size-4.5" strokeWidth={2.2} />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight text-foreground">
            {transaction.description || "No description"}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <TagIcon className="size-3 text-muted-foreground/40" />
            <span className="truncate text-xs text-muted-foreground/70 capitalize">
              {category}
            </span>
          </div>
        </div>

        {/* Amount + Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              isIncome ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isIncome ? "+" : "-"}
            {currencyFormatter.format(transaction.amount)}
          </span>
          <TransactionItemActions
            transaction={transaction as any}
            setIsOpenDialog={setIsDialogOpen}
          />
        </div>
      </motion.div>
    </Dialog>
  );
}
