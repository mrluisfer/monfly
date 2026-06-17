import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { format, isToday, isYesterday } from "date-fns";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import { ArrowDownLeftIcon, CalendarIcon } from "lucide-react";

import { CardSummary } from "./CardBadge";
import { TransactionRow } from "./TransactionRow";

type TransactionCardListProps = {
  data: Transaction[];
  cardsById?: Map<string, CardSummary>;
};

function formatRelativeDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

function groupTransactionsByDate(
  transactions: Transaction[],
): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const key = formatRelativeDate(new Date(tx.date));
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }
  return groups;
}

export function TransactionCardList({
  data,
  cardsById,
}: TransactionCardListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="bg-muted/60 mb-4 rounded-full p-4">
          <ArrowDownLeftIcon className="text-muted-foreground/60 size-6" />
        </div>
        <p className="text-muted-foreground font-medium">No transactions yet</p>
        <p className="text-muted-foreground/60 mt-1 text-sm">
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
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : groupIdx * 0.05,
                }}
              >
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1.5">
                    <CalendarIcon className="text-muted-foreground/70 size-3.5" />
                    <h3 className="text-muted-foreground text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
                      {dateLabel}
                    </h3>
                  </span>
                  <div className="bg-border/50 h-px flex-1" />
                  <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-semibold">
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
