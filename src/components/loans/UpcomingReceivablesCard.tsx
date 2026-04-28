import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ClockIcon, HandCoinsIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useLoans } from "~/hooks/loans/useLoans";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const HORIZON_DAYS = 30;
const MAX_VISIBLE = 5;

type ReceivableEntry = {
  id: string;
  debtor: string;
  remaining: number;
  dueAt: Date | null;
  daysUntilDue: number | null;
  status: string;
};

function buildEntries(
  loans: { id: string; debtor: string; amount: number; amountPaid: number; status: string; dueAt: Date | string | null }[],
  now: Date
): ReceivableEntry[] {
  const entries = loans
    .filter((l) => l.status !== "paid")
    .map((l) => {
      const remaining = Math.max(l.amount - l.amountPaid, 0);
      const dueAt = l.dueAt ? new Date(l.dueAt) : null;
      const daysUntilDue = dueAt
        ? Math.round((dueAt.getTime() - now.getTime()) / MS_PER_DAY)
        : null;
      return {
        id: l.id,
        debtor: l.debtor,
        remaining,
        dueAt,
        daysUntilDue,
        status: l.status,
      };
    })
    .filter((e) => e.remaining > 0);

  // Sort: items with a due date first (earliest first), then dateless ones,
  // and within those by remaining desc so the largest unscheduled debts surface.
  entries.sort((a, b) => {
    if (a.dueAt && b.dueAt) return a.dueAt.getTime() - b.dueAt.getTime();
    if (a.dueAt) return -1;
    if (b.dueAt) return 1;
    return b.remaining - a.remaining;
  });

  return entries;
}

function dueLabel(entry: ReceivableEntry) {
  if (entry.dueAt === null) return "No due date";
  if (entry.daysUntilDue === null) return "—";
  if (entry.daysUntilDue < 0) {
    const overdue = Math.abs(entry.daysUntilDue);
    return `${overdue}d overdue`;
  }
  if (entry.daysUntilDue === 0) return "Due today";
  if (entry.daysUntilDue === 1) return "Due tomorrow";
  return `In ${entry.daysUntilDue}d`;
}

function dueTone(entry: ReceivableEntry) {
  if (entry.dueAt === null) return "text-muted-foreground";
  if (entry.daysUntilDue === null) return "text-muted-foreground";
  if (entry.daysUntilDue < 0) return "text-destructive";
  if (entry.daysUntilDue <= 3) return "text-warning-foreground dark:text-warning";
  return "text-muted-foreground";
}

export function UpcomingReceivablesCard() {
  const { data, isPending, error } = useLoans();
  const now = new Date();

  return (
    <section className="bg-card border-border/60 flex flex-col gap-3 rounded-2xl border p-4">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="bg-warning/15 text-warning-foreground dark:text-warning flex size-8 items-center justify-center rounded-xl"
          >
            <HandCoinsIcon className="size-4" />
          </span>
          <div>
            <h3 className="text-foreground text-sm font-semibold tracking-tight">
              Upcoming receivables
            </h3>
            <p className="text-muted-foreground text-xs">
              Loans not yet collected
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          render={<Link to="/home/loans" />}
        >
          View all
          <ArrowRightIcon className="size-3" aria-hidden="true" />
        </Button>
      </header>

      <UpcomingBody
        isPending={isPending}
        error={!!(error || data?.error)}
        loans={data?.data ?? []}
        now={now}
      />
    </section>
  );
}

function UpcomingBody({
  isPending,
  error,
  loans,
  now,
}: {
  isPending: boolean;
  error: boolean;
  loans: any[];
  now: Date;
}) {
  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">Failed to load receivables.</p>
    );
  }

  const entries = buildEntries(loans as any, now);

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground py-2 text-sm">
        Nothing pending. You&apos;re fully collected.
      </p>
    );
  }

  const totalOutstanding = entries.reduce((s, e) => s + e.remaining, 0);
  const visible = entries.slice(0, MAX_VISIBLE);
  const hidden = entries.length - visible.length;

  return (
    <div className="space-y-3">
      <div className="text-foreground flex items-baseline justify-between">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(totalOutstanding, "USD")}
        </span>
        <span className="text-muted-foreground text-xs">
          {entries.length} pending
        </span>
      </div>

      <ul role="list" className="divide-border/60 divide-y">
        {visible.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between gap-2 py-2"
          >
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-medium capitalize">
                {entry.debtor}
              </p>
              <p
                className={cn(
                  "inline-flex items-center gap-1 text-xs",
                  dueTone(entry)
                )}
              >
                <ClockIcon className="size-3" aria-hidden="true" />
                {dueLabel(entry)}
              </p>
            </div>
            <span className="text-foreground shrink-0 text-sm font-semibold tabular-nums">
              {formatCurrency(entry.remaining, "USD")}
            </span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <p className="text-muted-foreground text-xs">
          + {hidden} more —{" "}
          <Link to="/home/loans" className="text-primary hover:underline">
            see all
          </Link>
        </p>
      )}
    </div>
  );
}
