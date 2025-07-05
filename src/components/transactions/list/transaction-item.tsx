import { ReactNode, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import UserAvatar from "~/components/user-avatar";
import { transactionTypes } from "~/constants/transaction-types";
import { useTransactionHoverContext } from "~/hooks/use-transaction-hover-context";
import type { TransactionWithUser } from "~/types/TransactionWithUser";
import { formatCurrency } from "~/utils/format-currency";
import clsx from "clsx";
import { format, formatDistance, formatDistanceToNow, subDays } from "date-fns";

import { Dialog } from "../../ui/dialog";
import TransactionItemActions from "./transaction-item-actions";

export default function TransactionItem({
  transaction,
}: {
  transaction: TransactionWithUser;
}) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { disableHover } = useTransactionHoverContext();

  const textBase = "text-base font-medium";
  const textMuted = "text-sm opacity-50 text-muted-foreground";

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger className="w-full" disabled={disableHover}>
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <div className="flex items-center gap-4 hover:bg-muted rounded-md px-2 transition-colors">
              <UserAvatar
                alt={transaction.user.name ?? ""}
                name={transaction.user.name ?? ""}
              />
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <p className={clsx(textBase, "font-semibold truncate")}>
                    {transaction.description}
                  </p>
                  <span className={textMuted}>
                    {transaction.user.name} - {transaction.user.email}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <p
                      className={clsx(
                        textBase,
                        transaction.type === transactionTypes.INCOME
                          ? "text-green-500 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      )}
                    >
                      {transaction.type === transactionTypes.INCOME ? "+" : "-"}
                      {formatCurrency(transaction.amount, "MXN")}
                    </p>
                    <span className={clsx(textMuted, "text-xs capitalize")}>
                      {formatDistance(
                        subDays(new Date(transaction.createdAt), 0),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                  <TransactionItemActions
                    transaction={transaction}
                    setIsOpenDialog={setIsOpenDialog}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </TooltipTrigger>
        {disableHover ? (
          <TooltipContent
            className="py-3"
            align="center"
            side="right"
            aria-disabled={disableHover}
          >
            <ul className="grid gap-3 text-xs">
              <TransactionTooltipContentItem
                title="Transaction ID"
                value={transaction.id}
              />
              <TransactionTooltipContentItem
                title="Type"
                value={transaction.type}
              />
              <TransactionTooltipContentItem
                title="Category"
                value={transaction.category}
              />
              {transaction.description && (
                <TransactionTooltipContentItem
                  title="Description"
                  value={transaction.description}
                />
              )}
              <TransactionTooltipContentItem
                title="Transaction made"
                value={
                  <>
                    {format(
                      transaction.date,
                      "EEEE, MMMM d, yyyy · hh:mm aaaa"
                    )}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      (
                      {formatDistanceToNow(transaction.date, {
                        addSuffix: true,
                      })}
                      )
                    </span>
                  </>
                }
              />
              <TransactionTooltipContentItem
                title="Recorded by"
                value={transaction.user.email}
                id="email"
              />
            </ul>
          </TooltipContent>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  );
}

function TransactionTooltipContentItem({
  title,
  value,
  id,
}: {
  title: string;
  value: string | ReactNode;
  id?: string;
}) {
  return (
    <li className="grid gap-0.5">
      <span className="text-muted-foreground text-xs opacity-70">{title}</span>
      <span
        className={clsx(
          "font-medium break-all text-wrap capitalize text-xs text-left w-full whitespace-pre-wrap opacity-80",
          id === "email" && "text-wrap lowercase"
        )}
      >
        {value}
      </span>
    </li>
  );
}
