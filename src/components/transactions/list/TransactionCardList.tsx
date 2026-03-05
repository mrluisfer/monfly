import { TransactionWithUser as Transaction } from "~/types/TransactionWithUser";
import { format, isToday, isYesterday } from "date-fns";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { ArrowDownLeftIcon, CalendarIcon } from "lucide-react";

import { TransactionRow } from "./TransactionRow";

type TransactionCardListProps = {
  data: Transaction[];
};

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
