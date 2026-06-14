import { useQueryClient } from "@tanstack/react-query";
import { m } from "motion/react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  EditIcon,
  HandCoinsIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { Dialog } from "~/components/ui/dialog";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";

import EditTransaction from "../EditTransaction";
import { TransactionFormDialogContent } from "../TransactionFormDialogContent";
import TransactionItemActions from "./TransactionItemActions";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TransactionRow({
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
      : ((transaction.category as { name?: string } | null)?.name ??
        "Uncategorized");

  const deleteTransactionByIdMutation = useMutation({
    fn: deleteTransactionByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({
          title: response.message ?? "Failed to delete transaction",
        });
        return;
      }

      sileo.success({ title: "Transaction deleted successfully" });
      await invalidateTransactionQueries(queryClient, transaction.userEmail);
    },
    idempotency: {
      getKey: (variables) => variables.data.id,
      onDuplicatePending: {
        title: "Transaction is already being deleted",
      },
      onDuplicateRecentSuccess: {
        title: "Transaction already deleted",
      },
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
                "group flex items-center gap-3 rounded-2xl px-3.5 py-3.5 select-none",
                "bg-muted/50 hover:bg-muted",
                "transition-colors duration-200",
                "active:scale-[0.98] active:transition-transform active:duration-100",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl md:size-11",
                  "shadow-[0_18px_28px_-24px_rgba(15,23,42,0.55)] transition-shadow duration-200",
                  isIncome
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {isIncome ? (
                  <ArrowUpRightIcon className="size-4" strokeWidth={2.2} />
                ) : (
                  <ArrowDownLeftIcon className="size-4" strokeWidth={2.2} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm leading-tight font-semibold tracking-tight">
                  {transaction.description || "No description"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground/78 inline-flex items-center gap-1.5 text-xs capitalize">
                    <TagIcon className="text-muted-foreground/50 size-3" />
                    {category}
                  </span>
                  <span className="bg-border/80 h-1 w-1 rounded-full" />
                  <span className="text-muted-foreground/78 inline-flex items-center gap-1.5 text-xs">
                    <CalendarIcon className="text-muted-foreground/50 size-3" />
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {((transaction.loanCount ?? 0) > 0 ||
                    transaction.appliedToLoanId) && (
                    <>
                      <span className="bg-border/80 h-1 w-1 rounded-full" />
                      <span
                        className="border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                        title={
                          transaction.appliedToLoanId
                            ? "This transaction was applied as a payment to a loan"
                            : "This transaction is tracked as a loan"
                        }
                      >
                        <HandCoinsIcon className="size-3" aria-hidden="true" />
                        {transaction.appliedToLoanId ? "Loan payment" : "Loan"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold tabular-nums",
                    isIncome
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {currencyFormatter.format(transaction.amount)}
                </span>
                <TransactionItemActions
                  transaction={transaction}
                  setIsOpenDialog={setIsDialogOpen}
                />
              </div>
            </m.div>
          }
        />

        <ContextMenuContent className="animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 w-56 space-y-2 duration-200">
          <ContextMenuGroup>
            <ContextMenuLabel>Actions for transaction</ContextMenuLabel>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setIsDialogOpen(true)}>
            <EditIcon />
            Edit transaction
          </ContextMenuItem>
          <ContextMenuItem
            disabled={deleteTransactionByIdMutation.status === "pending"}
            onClick={() =>
              deleteTransactionByIdMutation.mutate({
                data: {
                  id: transaction.id,
                },
              })
            }
          >
            <TrashIcon />
            {deleteTransactionByIdMutation.status === "pending"
              ? "Deleting..."
              : "Delete transaction"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <TransactionFormDialogContent
        title="Edit transaction"
        description="Update the amount, category, type, or date without leaving the current flow."
      >
        <EditTransaction
          transaction={transaction}
          onClose={() => setIsDialogOpen(false)}
        />
      </TransactionFormDialogContent>
    </Dialog>
  );
}
