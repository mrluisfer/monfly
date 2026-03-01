import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useMutation } from "~/hooks/use-mutation";
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";
import { format, isToday, isYesterday } from "date-fns";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  EditIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";

import EditTransaction from "../edit-transaction";
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
  const shouldReduceMotion = useReducedMotion();

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
    <LazyMotion features={domAnimation}>
      <div className="space-y-5 pb-4">
        <AnimatePresence mode="popLayout">
          {Object.entries(grouped).map(
            ([dateLabel, transactions], groupIdx) => (
              <m.section
                key={dateLabel}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : groupIdx * 0.05,
                }}
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
                      reduceMotion={Boolean(shouldReduceMotion)}
                    />
                  ))}
                </div>
              </m.section>
            )
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

function TransactionRow({
  transaction,
  index,
  groupDelay,
  reduceMotion,
}: {
  transaction: Transaction;
  index: number;
  groupDelay: number;
  reduceMotion: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isIncome = transaction.type.toLowerCase() === "income";
  const category =
    typeof transaction.category === "string"
      ? transaction.category
      : (transaction.category as any)?.name || "Uncategorized";

  const deleteTransactionByIdMutation = useMutation({
    fn: deleteTransactionByIdServer,
    onSuccess: async () => {
      sileo.success({ title: "Transaction deleted successfully" });
      await invalidateTransactionQueries(queryClient, transaction.userEmail);
    },
  });

  useEffect(() => {
    if (
      deleteTransactionByIdMutation.status === "error" &&
      deleteTransactionByIdMutation.error
    ) {
      sileo.error({ title: "Failed to delete transaction" });
    }
  }, [
    deleteTransactionByIdMutation.status,
    deleteTransactionByIdMutation.error,
  ]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <m.div
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.25,
                delay: reduceMotion
                  ? 0
                  : groupDelay + Math.min(index * 0.04, 0.2),
                ease: "easeOut",
              }}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 select-none",
                "bg-background/60 hover:bg-muted/50",
                "transition-colors duration-200",
                "active:scale-[0.98] active:transition-transform active:duration-100"
              )}
            >
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
            </m.div>
          }
        />

        <ContextMenuContent
          className="
            w-56 space-y-2
            animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200
          "
        >
          <ContextMenuGroup>
            <ContextMenuLabel>Actions for transaction</ContextMenuLabel>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="
              transition-all duration-200 ease-out
              hover:bg-primary/10 focus:bg-primary/10
              cursor-pointer group
            "
            onClick={() => setIsDialogOpen(true)}
          >
            <EditIcon className="size-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            Edit transaction
          </ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            className="
              transition-all duration-200 ease-out
              hover:bg-destructive/10 focus:bg-destructive/10
              cursor-pointer group
            "
            disabled={deleteTransactionByIdMutation.status === "pending"}
            onClick={() =>
              deleteTransactionByIdMutation.mutate({
                data: {
                  id: transaction.id,
                },
              })
            }
          >
            <TrashIcon className="size-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            {deleteTransactionByIdMutation.status === "pending"
              ? "Deleting..."
              : "Delete transaction"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Edit the transaction details</DialogDescription>
        </DialogHeader>
        <EditTransaction
          transaction={transaction}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
