import { useAtomValue } from "jotai";
import { m } from "motion/react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  EditIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { getCategoryIconByName } from "@/constants/categories/categories-icon";
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
import { useDeleteTransaction } from "~/hooks/transactions";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { cn } from "~/lib/utils";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { maskCurrency } from "~/utils/format-currency";

import EditTransaction from "../EditTransaction";
import { TransactionFormDialogContent } from "../TransactionFormDialogContent";
import { CardBadge, type CardSummary } from "./CardBadge";
import { LoanBadge } from "./LoanBadge";
import { RelativeTime } from "./RelativeTime";
import TransactionItemActions from "./TransactionItemActions";
import { transactionTypes } from "@/constants/transaction-types";

export function TransactionRow({
  transaction,
  index,
  groupDelay,
  reduceMotion,
  card,
  categoryIconName,
}: {
  transaction: Transaction;
  index: number;
  groupDelay: number;
  reduceMotion: boolean;
  card?: CardSummary | null;
  categoryIconName?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currency = usePreferredCurrency();
  const hideBalance = useAtomValue(hideBalanceAtom);
  const isIncome = transaction.type.toLowerCase() === transactionTypes.INCOME;
  const category =
    typeof transaction.category === "string"
      ? transaction.category
      : ((transaction.category as { name?: string } | null)?.name ??
        "Uncategorized");

  const deleteTransactionByIdMutation = useDeleteTransaction(
    transaction.userEmail,
  );

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
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 select-none",
                "bg-card ring-border/60 ring-1 ring-inset",
                "transition-[background-color,box-shadow] duration-200",
                "hover:bg-accent/40 hover:ring-border hover:shadow-sm",
                "active:scale-[0.98] active:transition-transform active:duration-100",
              )}
            >
              {/* Direction is read at a glance from a compact circular badge —
                  tinted fill + soft ring + arrow — so the row stays scannable
                  without the heavier squared icon it used to carry. */}
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full ring-1 transition-colors",
                  isIncome
                    ? "bg-primary/10 text-primary ring-primary/20"
                    : "bg-destructive/10 text-destructive ring-destructive/20",
                )}
                aria-hidden="true"
              >
                {isIncome ? (
                  <ArrowUpRightIcon className="size-4" strokeWidth={2.4} />
                ) : (
                  <ArrowDownLeftIcon className="size-4" strokeWidth={2.4} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm leading-tight font-semibold tracking-tight">
                  {transaction.description || "No description"}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground/78 inline-flex max-w-full min-w-0 items-center gap-1.5 text-xs capitalize [&>svg]:size-3 [&>svg]:shrink-0">
                    {categoryIconName ? (
                      getCategoryIconByName(categoryIconName, {
                        className: "text-primary",
                        "aria-hidden": true,
                      })
                    ) : (
                      <TagIcon className="text-primary size-3" />
                    )}
                    <span className="truncate">{category}</span>
                  </span>
                  <span className="bg-border/80 h-1 w-1 rounded-full" />
                  <RelativeTime
                    date={transaction.createdAt}
                    className="text-muted-foreground/78 text-xs"
                  />
                  {card && (
                    <>
                      <span className="bg-border/80 h-1 w-1 rounded-full" />
                      <CardBadge
                        card={card}
                        className="max-w-[140px] px-2 py-0 text-[11px]"
                      />
                    </>
                  )}
                  {((transaction.loanCount ?? 0) > 0 ||
                    transaction.appliedToLoanId) && (
                    <>
                      <span className="bg-border/80 h-1 w-1 rounded-full" />
                      <LoanBadge
                        isPayment={Boolean(transaction.appliedToLoanId)}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Amount stays plain text — the colored badge already signals
                  direction, so sign + color here is enough and reads cleaner
                  than another pill. */}
              <div className="flex shrink-0 items-center gap-1">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    isIncome ? "text-primary" : "text-destructive",
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {maskCurrency(transaction.amount, currency, hideBalance)}
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
