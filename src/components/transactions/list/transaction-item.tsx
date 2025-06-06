import { ReactNode, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import UserAvatar from "~/components/user-avatar";
import { transactionTypes } from "~/constants/transaction-types";
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

  const textBase = "text-base font-medium";
  const textMuted = "text-sm opacity-50";

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <div className="flex items-center gap-4 hover:bg-muted px-2 rounded-md transition-colors">
              <UserAvatar
                alt={transaction.user.name ?? ""}
                name={transaction.user.name ?? ""}
                size={10}
              />
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <p className={clsx(textBase, "capitalize")}>
                    {transaction.user.name}
                  </p>
                  <span className={textMuted}>{transaction.user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
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
        <TooltipContent className="py-3" align="center" side="bottom">
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
              title="Registered at"
              value={
                <>
                  {format(
                    transaction.createdAt,
                    "EEEE, MMMM d, yyyy · hh:mm aaaa"
                  )}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    (
                    {formatDistanceToNow(transaction.createdAt, {
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
