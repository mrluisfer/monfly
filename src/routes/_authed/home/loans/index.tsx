import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MetricCard } from "~/components/ui/metric-card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { LOAN_STATUS_LABEL, type LoanStatus } from "~/constants/loan-status";
import { useAddLoan } from "~/hooks/loans/useAddLoan";
import { useDeleteLoan } from "~/hooks/loans/useDeleteLoan";
import { useLoans } from "~/hooks/loans/useLoans";
import { useUpdateLoan } from "~/hooks/loans/useUpdateLoan";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";
import {
  AlertCircleIcon,
  BanknoteArrowUpIcon,
  CalendarIcon,
  CheckCheck,
  CircleDollarSignIcon,
  FileTextIcon,
  HandCoinsIcon,
  PlusCircleIcon,
  RotateCcwIcon,
  Trash2Icon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import { Controller } from "react-hook-form";

import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/_authed/home/loans/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Loans"
        description="Track who owes you money — friends, refunds (SAT, insurance), or any expected income. Mark partial or full payments."
        icon={<HandCoinsIcon className="size-5" aria-hidden="true" />}
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <AddLoanCard />
        <LoansList />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Add loan form                                                              */
/* -------------------------------------------------------------------------- */

function AddLoanCard() {
  const { form, onSubmit, mutation } = useAddLoan();
  const isLoading = mutation.status === "pending";
  const errors = form.formState.errors;

  return (
    <section
      className="bg-card border-border/60 flex flex-col gap-5 rounded-2xl border p-5"
      aria-labelledby="add-loan-heading"
    >
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl"
        >
          <PlusCircleIcon className="size-4" />
        </span>
        <div>
          <h2
            id="add-loan-heading"
            className="text-sm font-semibold tracking-tight"
          >
            New loan
          </h2>
          <p className="text-muted-foreground text-xs">
            Register a debt someone owes you.
          </p>
        </div>
      </header>

      <Separator />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Field
          label="Debtor"
          error={errors.debtor?.message}
          icon={<UserIcon className="size-3.5" />}
        >
          <Controller
            control={form.control}
            name="debtor"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="e.g. Juan, SAT, Insurance Co."
                autoComplete="off"
              />
            )}
          />
        </Field>

        <Field
          label="Amount (USD)"
          error={errors.amount?.message}
          icon={<CircleDollarSignIcon className="size-3.5" />}
        >
          <Controller
            control={form.control}
            name="amount"
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            )}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Issued at" icon={<CalendarIcon className="size-3.5" />}>
            <Controller
              control={form.control}
              name="issuedAt"
              render={({ field }) => (
                <Input
                  type="date"
                  value={toDateInputValue(field.value)}
                  onChange={(e) =>
                    field.onChange(fromDateInputValue(e.target.value))
                  }
                />
              )}
            />
          </Field>
          <Field
            label="Due (optional)"
            icon={<CalendarIcon className="size-3.5" />}
          >
            <Controller
              control={form.control}
              name="dueAt"
              render={({ field }) => (
                <Input
                  type="date"
                  value={toDateInputValue(field.value ?? null)}
                  onChange={(e) =>
                    field.onChange(fromDateInputValue(e.target.value))
                  }
                />
              )}
            />
          </Field>
        </div>

        <Field
          label="Notes (optional)"
          icon={<FileTextIcon className="size-3.5" />}
        >
          <Controller
            control={form.control}
            name="notes"
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value ?? ""}
                rows={2}
                placeholder="Context, agreement, etc."
              />
            )}
          />
        </Field>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving…" : "Create loan"}
        </Button>
      </form>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Loans list                                                                 */
/* -------------------------------------------------------------------------- */

type StatusFilter = "all" | LoanStatus;

function LoansList() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const { data, isPending, error } = useLoans();
  const update = useUpdateLoan();
  const del = useDeleteLoan();

  if (isPending) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-64 rounded-2xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !data || data.error || !data.data) {
    return (
      <div className="bg-destructive/5 border-destructive/20 text-destructive flex items-center gap-3 rounded-2xl border p-5 text-sm">
        <AlertCircleIcon className="size-5 shrink-0" aria-hidden="true" />
        <span>Failed to load loans. Please try again later.</span>
      </div>
    );
  }

  const allLoans = data.data;

  if (allLoans.length === 0) {
    return (
      <div className="bg-card border-border/60 flex flex-col items-center gap-3 rounded-2xl border p-12 text-center">
        <span
          aria-hidden="true"
          className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-2xl"
        >
          <HandCoinsIcon className="size-6" />
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
    { all: 0, pending: 0, partial: 0, paid: 0 } as Record<StatusFilter, number>
  );

  const loans =
    filter === "all" ? allLoans : allLoans.filter((l) => l.status === filter);

  const totals = allLoans.reduce(
    (acc, l) => {
      acc.total += l.amount;
      acc.paid += l.amountPaid;
      if (l.status !== "paid") acc.outstanding += l.amount - l.amountPaid;
      return acc;
    },
    { total: 0, paid: 0, outstanding: 0 }
  );

  return (
    <div className="space-y-4">
      {/* Summary metric cards */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Outstanding"
          value={formatCurrency(totals.outstanding, "USD")}
          accent="destructive"
          icon={<AlertCircleIcon className="size-4" aria-hidden="true" />}
        />
        <MetricCard
          label="Received"
          value={formatCurrency(totals.paid, "USD")}
          accent="success"
          icon={<TrendingUpIcon className="size-4" aria-hidden="true" />}
        />
        <MetricCard
          label="Total"
          value={formatCurrency(totals.total, "USD")}
          accent="primary"
          icon={<CircleDollarSignIcon className="size-4" aria-hidden="true" />}
        />
      </div>

      {/* Status filter tabs */}
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as StatusFilter)}
      >
        <TabsList>
          <TabsTrigger value="all">
            All <CountBadge n={counts.all} />
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <CountBadge n={counts.pending} />
          </TabsTrigger>
          <TabsTrigger value="partial">
            Partial <CountBadge n={counts.partial} />
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid <CountBadge n={counts.paid} />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loan items */}
      {loans.length === 0 ? (
        <div className="bg-card border-border/60 text-muted-foreground rounded-2xl border p-8 text-center text-sm">
          No {filter} loans.
        </div>
      ) : (
        <ul
          role="list"
          aria-label="Loans"
          className="bg-card border-border/60 divide-border/50 divide-y overflow-hidden rounded-2xl border"
        >
          {loans.map((loan) => (
            <LoanListItem
              key={loan.id}
              loan={loan}
              onMarkPaid={() => update.markPaid(loan.id)}
              onMarkPending={() => update.markPending(loan.id)}
              onRecordPayment={(amount) =>
                update.recordPayment(loan.id, loan.amountPaid + amount)
              }
              onDelete={() => {
                if (confirm(`Delete loan from ${loan.debtor}?`)) {
                  del.remove(loan.id);
                }
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loan list item                                                             */
/* -------------------------------------------------------------------------- */

type LoanRow = {
  id: string;
  debtor: string;
  amount: number;
  amountPaid: number;
  status: string;
  dueAt?: Date | string | null;
  notes?: string | null;
};

function LoanListItem({
  loan,
  onMarkPaid,
  onMarkPending,
  onRecordPayment,
  onDelete,
}: {
  loan: LoanRow;
  onMarkPaid: () => void;
  onMarkPending: () => void;
  onRecordPayment: (amount: number) => void;
  onDelete: () => void;
}) {
  const status = loan.status as LoanStatus;
  const isPaid = status === "paid";
  const remaining = Math.max(loan.amount - loan.amountPaid, 0);
  const progressPct =
    loan.amount > 0 ? Math.round((loan.amountPaid / loan.amount) * 100) : 0;

  return (
    <li className="flex flex-col gap-3 px-4 py-4">
      {/* Top row: debtor info + remaining */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-foreground text-sm font-semibold capitalize">
              {loan.debtor}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="text-muted-foreground text-xs tabular-nums">
            <span>{formatCurrency(loan.amount, "USD")} total</span>
            {loan.amountPaid > 0 && (
              <>
                {" · "}
                <span className="text-foreground">
                  {formatCurrency(loan.amountPaid, "USD")}
                </span>{" "}
                paid
              </>
            )}
            {loan.dueAt && (
              <>
                {" · due "}
                {new Date(loan.dueAt).toLocaleDateString()}
              </>
            )}
          </p>
          {loan.notes && (
            <p className="text-muted-foreground flex items-center gap-1 text-xs italic">
              <FileTextIcon className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{loan.notes}</span>
            </p>
          )}
        </div>

        {!isPaid && remaining > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-foreground text-base font-semibold tabular-nums">
              {formatCurrency(remaining, "USD")}
            </p>
            <p className="text-muted-foreground text-xs">remaining</p>
          </div>
        )}
      </div>

      {/* Payment progress bar */}
      {loan.amountPaid > 0 && (
        <div
          role="progressbar"
          aria-label={`${progressPct}% paid`}
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isPaid ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2">
        {!isPaid && <PartialPaymentControl onSubmit={onRecordPayment} />}
        <div className="ml-auto flex items-center gap-2">
          {!isPaid ? (
            <Button type="button" variant="default" onClick={onMarkPaid}>
              <CheckCheck aria-hidden="true" />
              Mark paid
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onMarkPending}>
              <RotateCcwIcon aria-hidden="true" />
              Reopen
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  aria-label={`Delete loan from ${loan.debtor}`}
                  onClick={onDelete}
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
              }
            />
            <TooltipContent side="top">Delete loan</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Presentational helpers                                                     */
/* -------------------------------------------------------------------------- */

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted-foreground/15 px-1 text-[10px] font-medium tabular-nums">
      {n}
    </span>
  );
}

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
        {icon}
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-destructive text-xs">
          {error}
        </span>
      )}
    </label>
  );
}

function StatusBadge({ status }: { status: LoanStatus }) {
  const variants = {
    paid: "secondary",
    pending: "default",
    partial: "outline",
  };

  return (
    <Badge
      className={cn(
        "uppercase tracking-wide"
        // status === "paid" && "border-success/20 bg-success/10 text-success",
        // status === "partial" && "border-warning/20 bg-warning/15 text-warning-foreground dark:text-warning",
        // status === "pending" && "border-border bg-muted text-muted-foreground"
      )}
      variant={(variants[status] as keyof typeof buttonVariants) || "outline"}
    >
      {LOAN_STATUS_LABEL[status]}
    </Badge>
  );
}

function PartialPaymentControl({
  onSubmit,
}: {
  onSubmit: (amount: number) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const raw = String(fd.get("amount") ?? "");
        const amount = Number(raw);
        if (!Number.isFinite(amount) || amount <= 0) return;
        onSubmit(amount);
        (e.currentTarget as HTMLFormElement).reset();
      }}
      className="flex items-center gap-2"
    >
      <Input
        name="amount"
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        placeholder="$0.00"
        className="h-9 w-36"
        aria-label="Partial payment amount"
      />
      <Button type="submit" variant="default">
        <BanknoteArrowUpIcon />
      </Button>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Date <-> input helpers (input[type=date] uses YYYY-MM-DD)                   */
/* -------------------------------------------------------------------------- */

function toDateInputValue(value: Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fromDateInputValue(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
