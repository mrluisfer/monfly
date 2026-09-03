import { format, isToday, isYesterday } from "date-fns";
import { ArrowDownLeftIcon, CalendarIcon } from "lucide-react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import type { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";

import type { CardSummary } from "./CardBadge";
import { TransactionRow } from "./TransactionRow";

interface TransactionCardListProps {
  cardsById?: Map<string, CardSummary>;
  categoryIconsByName?: Map<string, string>;
  data: Transaction[];
}

function formatRelativeDate(date: Date): string {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MMM d, yyyy");
}

function groupTransactionsByDate(
  transactions: Transaction[],
): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const key = formatRelativeDate(new Date(tx.date));
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  }
  return groups;
}

export function TransactionCardList({
  data,
  cardsById,
  categoryIconsByName,
}: TransactionCardListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 rounded-full bg-muted/60 p-4">
          <ArrowDownLeftIcon className="size-6 text-muted-foreground/60" />
        </div>
        <p className="font-medium text-muted-foreground">No transactions yet</p>
        <p className="mt-1 text-muted-foreground/60 text-sm">
          Your transactions will appear here
        </p>
      </div>
    );
  }

  const grouped = groupTransactionsByDate(data);

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-5 pb-1">
        <AnimatePresence mode="popLayout">
          {Object.entries(grouped).map(
            ([dateLabel, transactions], groupIdx) => (
              <m.section
                key={dateLabel}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : groupIdx * 0.05,
                  duration: shouldReduceMotion ? 0 : 0.3,
                }}
              >
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                    <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                    <h3 className="font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.22em]">
                      {dateLabel}
                    </h3>
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-[10px] text-muted-foreground">
                    {transactions.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {transactions.map((transaction, index) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      index={index}
                      groupDelay={groupIdx * 0.05}
                      reduceMotion={Boolean(shouldReduceMotion)}
                      card={
                        transaction.cardId
                          ? cardsById?.get(transaction.cardId)
                          : undefined
                      }
                      categoryIconName={categoryIconsByName?.get(
                        String(transaction.category).trim().toLowerCase(),
                      )}
                    />
                  ))}
                </div>
              </m.section>
            ),
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
