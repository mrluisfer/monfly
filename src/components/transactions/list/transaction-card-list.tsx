import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Dialog } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";

import TransactionItemActions from "./transaction-item-actions";

type TransactionCardListProps = {
  data: Transaction[];
};

export function TransactionCardList({ data }: TransactionCardListProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-card rounded-xl border p-4 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 backdrop-blur-sm border border-border/50",
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
            <div>
              <p className="font-medium line-clamp-1">
                {transaction.description || "No description"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 max-w-[100px] truncate">
                  {typeof transaction.category === 'string' ? transaction.category : (transaction.category as any)?.name || 'Uncategorized'}
                </Badge>
                <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "font-bold",
                transaction.type === "INCOME"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {transaction.type === "INCOME" ? "+" : "-"}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(transaction.amount)}
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
