import {AlertCircleIcon, HandCoinsIcon, TrendingUpIcon} from "lucide-react";
import {useState} from "react";
import {MetricCard} from "~/components/ui/metric-card";
import {Skeleton} from "~/components/ui/skeleton";
import {Tabs, TabsList, TabsTrigger} from "~/components/ui/tabs";
import {type LoanDirection, type LoanStatus} from "~/constants/loan-status";
import {useDeleteLoan} from "~/hooks/loans/useDeleteLoan";
import {useLoanPayment} from "~/hooks/loans/useLoanPayment";
import {useLoans} from "~/hooks/loans/useLoans";
import {useUpdateLoan} from "~/hooks/loans/useUpdateLoan";

import {CountBadge} from "./CountBadge";
import {LoanDirectionIcon} from "./LoanDirectionIcon";
import {LoanListItem} from "./LoanListItem";
import type {DirectionFilter, StatusFilter} from "./types";
import {useMaskedAmount} from "./use-masked-amount";

/** The full loans dashboard: summary metrics, filters, and the loan list. */
export function LoansList() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [directionFilter, setDirectionFilter] =
    useState<DirectionFilter>("all");
  const {data, isPending, error} = useLoans();
  const update = useUpdateLoan();
  const payment = useLoanPayment();
  const del = useDeleteLoan();
  const maskAmount = useMaskedAmount();

  if (isPending) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({length: 3}).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl"/>
          ))}
        </div>
        <Skeleton className="h-10 w-64 rounded-2xl"/>
        {Array.from({length: 3}).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl"/>
        ))}
      </div>
    );
  }

  if (error || !data || data.error || !data.data) {
    return (
      <div
        className="bg-destructive/5 border-destructive/20 text-destructive flex items-center gap-3 rounded-2xl border p-5 text-sm">
        <AlertCircleIcon className="size-5 shrink-0" aria-hidden="true"/>
        <span>Failed to load loans. Please try again later.</span>
      </div>
    );
  }

  const allLoans = data.data;

  if (allLoans.length === 0) {
    return (
      <div
        className="bg-card border-border/60 flex h-fit flex-col items-center gap-3 rounded-2xl border p-12 text-center">
        <span
          aria-hidden="true"
          className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl"
        >
          <HandCoinsIcon className="size-6"/>
        </span>
        <div className="space-y-1">
          <p className="text-foreground text-sm font-medium">No loans yet</p>
          <p className="text-muted-foreground text-xs">
            Register your first loan using the form.
          </p>
        </div>
      </div>
    );
  }

  const counts = allLoans.reduce(
    (acc, l) => {
      acc.all += 1;
      acc[l.status as LoanStatus] = (acc[l.status as LoanStatus] ?? 0) + 1;
      return acc;
    },
    {all: 0, pending: 0, partial: 0, paid: 0} as Record<StatusFilter, number>,
  );

  const loans = allLoans.filter((l) => {
    const directionOk =
      directionFilter === "all" || (l.direction ?? "lent") === directionFilter;
    const statusOk = filter === "all" || l.status === filter;
    return directionOk && statusOk;
  });

  const directionCounts = allLoans.reduce(
    (acc, l) => {
      const dir = (l.direction ?? "lent") as LoanDirection;
      acc[dir] += 1;
      return acc;
    },
    {lent: 0, borrowed: 0} as Record<LoanDirection, number>,
  );

  const totals = allLoans.reduce(
    (acc, l) => {
      const dir = (l.direction ?? "lent") as LoanDirection;
      const remaining = l.status !== "paid" ? l.amount - l.amountPaid : 0;
      if (dir === "lent") {
        acc.lentOutstanding += remaining;
        acc.lentReceived += l.amountPaid;
      } else {
        acc.borrowedOutstanding += remaining;
        acc.borrowedPaid += l.amountPaid;
      }
      return acc;
    },
    {
      lentOutstanding: 0,
      lentReceived: 0,
      borrowedOutstanding: 0,
      borrowedPaid: 0,
    },
  );

  const netBalance = totals.lentOutstanding - totals.borrowedOutstanding;

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      {/* Summary metrics — Owed to me / I owe / Net */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        <MetricCard
          label="Owed to me"
          value={maskAmount(totals.lentOutstanding)}
          accent="success"
          icon={<LoanDirectionIcon direction="lent" colored={false}/>}
        />
        <MetricCard
          label="I owe"
          value={maskAmount(totals.borrowedOutstanding)}
          accent="destructive"
          icon={<LoanDirectionIcon direction="borrowed" colored={false}/>}
        />
        <MetricCard
          label="Net balance"
          className="sm:col-span-2 lg:col-span-1"
          value={maskAmount(netBalance)}
          accent={netBalance >= 0 ? "primary" : "destructive"}
          icon={
            netBalance >= 0 ? (
              <TrendingUpIcon className="size-4" aria-hidden="true"/>
            ) : (
              <AlertCircleIcon className="size-4" aria-hidden="true"/>
            )
          }
        />
      </div>

      <div
        className="flex w-full flex-wrap items-center justify-between gap-4 sm:gap-6 lg:grid lg:grid-cols-2 lg:gap-4 xl:gap-6">
        {/* Direction filter — quick toggle between perspectives */}
        <Tabs
          value={directionFilter}
          onValueChange={(value) =>
            setDirectionFilter(value as DirectionFilter)
          }
          className="w-full"
        >
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All
            </TabsTrigger>
            <TabsTrigger
              value="lent"
              className="flex-1 gap-1.5 sm:flex-initial"
            >
              <LoanDirectionIcon direction="lent" className="size-3.5"/>
              Owed to me
              <CountBadge n={directionCounts.lent}/>
            </TabsTrigger>
            <TabsTrigger
              value="borrowed"
              className="flex-1 gap-1.5 sm:flex-initial"
            >
              <LoanDirectionIcon direction="borrowed" className="size-3.5"/>
              I owe
              <CountBadge n={directionCounts.borrowed}/>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status filter tabs — full-width on mobile (4 equal columns), fits content on sm+ */}
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as StatusFilter)}
          className="w-full"
        >
          <TabsList className="ml-auto w-full sm:w-fit">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All
              <CountBadge n={counts.all}/>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-initial">
              Pending
              <CountBadge n={counts.pending}/>
            </TabsTrigger>
            <TabsTrigger value="partial" className="flex-1 sm:flex-initial">
              Partial
              <CountBadge n={counts.partial}/>
            </TabsTrigger>
            <TabsTrigger value="paid" className="flex-1 sm:flex-initial">
              Paid
              <CountBadge n={counts.paid}/>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Loan items */}
      {loans.length === 0 ? (
        <div className="bg-card border-border/60 text-muted-foreground rounded-2xl border p-8 text-center text-sm">
          No {filter} loans.
        </div>
      ) : (
        <ul
          role="list"
          aria-label="Loans"
          className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3 xl:gap-5"
        >
          {loans.map((loan) => (
            <LoanListItem
              key={loan.id}
              loan={loan}
              onMarkPaid={() => payment.markPaid(loan)}
              onMarkPending={() => payment.markPending(loan)}
              onRecordPayment={(amount) => payment.recordPayment(loan, amount)}
              onEdit={(patch) => update.update({id: loan.id, ...patch})}
              onDelete={() => del.remove(loan.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
