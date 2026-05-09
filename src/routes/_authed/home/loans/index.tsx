import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { MetricCard } from "~/components/ui/metric-card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  LOAN_DIRECTION_LABEL,
  LOAN_STATUS_LABEL,
  type LoanDirection,
  type LoanStatus,
} from "~/constants/loan-status";
import { useAddLoan } from "~/hooks/loans/useAddLoan";
import { useDeleteLoan } from "~/hooks/loans/useDeleteLoan";
import { useLoans } from "~/hooks/loans/useLoans";
import { useUpdateLoan } from "~/hooks/loans/useUpdateLoan";
import { cn } from "~/lib/utils";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { formatCurrency } from "~/utils/format-currency";
import { useAtomValue } from "jotai";
import {
  AlertCircleIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BanknoteArrowUpIcon,
  CalendarIcon,
  CheckCheck,
  ChevronDownIcon,
  CircleDollarSignIcon,
  FileTextIcon,
  HandCoinsIcon,
  PencilIcon,
  PlusCircleIcon,
  RotateCcwIcon,
  Trash2Icon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import { Controller } from "react-hook-form";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(340px,380px)_minmax(0,1fr)]">
        {/* Form: full-width on mobile/tablet, sticky aside on lg+ so it stays
            within reach while scrolling a long list. */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <AddLoanCard />
        </div>
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
  const [openCollapsible, setOpenCollapsible] = useState(false);

  return (
    <Collapsible
      className="bg-card border-border/60 flex flex-col gap-5 rounded-2xl border p-1"
      aria-labelledby="add-loan-heading"
      open={openCollapsible}
      onOpenChange={setOpenCollapsible}
    >
      <CollapsibleTrigger
        render={
          <Button
            variant={"ghost"}
            className="flex items-center gap-3 p-3 group h-16"
            size={"lg"}
          />
        }
      >
        <span
          aria-hidden="true"
          className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl"
        >
          <PlusCircleIcon className="size-4" />
        </span>
        <div>
          <h2
            id="add-loan-heading"
            className="text-sm font-semibold tracking-tight text-left select-none"
          >
            New loan
          </h2>
          <p className="text-muted-foreground text-xs select-none">
            Register a debt someone owes you.
          </p>
        </div>
        <ChevronDownIcon
          className={cn(
            "ml-auto group-data-[state=open]:rotate-180 transition-transform",
            openCollapsible ? "rotate-180" : "rotate-0"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-1 md:px-2"
          noValidate
        >
          <Controller
            control={form.control}
            name="direction"
            render={({ field }) => (
              <Tabs
                value={field.value}
                onValueChange={(v) => field.onChange(v as LoanDirection)}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="lent" className="flex-1 gap-1.5">
                    <ArrowDownLeftIcon
                      className="size-3.5"
                      aria-hidden="true"
                    />
                    Owed to me
                  </TabsTrigger>
                  <TabsTrigger value="borrowed" className="flex-1 gap-1.5">
                    <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
                    I owe
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />

          <Field
            label={
              form.watch("direction") === "borrowed" ? "Creditor" : "Debtor"
            }
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
            <Field
              label="Issued at"
              icon={<CalendarIcon className="size-3.5" />}
            >
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
      </CollapsibleContent>
    </Collapsible>
  );
}

/* -------------------------------------------------------------------------- */
/* Loans list                                                                 */
/* -------------------------------------------------------------------------- */

type StatusFilter = "all" | LoanStatus;
type DirectionFilter = "all" | LoanDirection;

function LoansList() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [directionFilter, setDirectionFilter] =
    useState<DirectionFilter>("all");
  const { data, isPending, error } = useLoans();
  const update = useUpdateLoan();
  const del = useDeleteLoan();
  const isBalanceHidden = useAtomValue(hideBalanceAtom);
  const maskAmount = (n: number) =>
    isBalanceHidden ? "$••••" : formatCurrency(n, "USD");

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
    { lent: 0, borrowed: 0 } as Record<LoanDirection, number>
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
    }
  );

  const netBalance = totals.lentOutstanding - totals.borrowedOutstanding;

  return (
    <div className="space-y-4">
      {/* Summary metrics — Owed to me / I owe / Net */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        <MetricCard
          label="Owed to me"
          value={maskAmount(totals.lentOutstanding)}
          accent="success"
          icon={<ArrowDownLeftIcon className="size-4" aria-hidden="true" />}
        />
        <MetricCard
          label="I owe"
          value={maskAmount(totals.borrowedOutstanding)}
          accent="destructive"
          icon={<ArrowUpRightIcon className="size-4" aria-hidden="true" />}
        />
        <MetricCard
          label="Net balance"
          value={maskAmount(netBalance)}
          accent={netBalance >= 0 ? "primary" : "destructive"}
          icon={
            netBalance >= 0 ? (
              <TrendingUpIcon className="size-4" aria-hidden="true" />
            ) : (
              <AlertCircleIcon className="size-4" aria-hidden="true" />
            )
          }
        />
      </div>

      <div className="lg:grid lg:grid-cols-2 gap-6 md:gap-2 xl:gap-0 flex items-center justify-between flex-wrap w-full">
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
              <ArrowDownLeftIcon className="size-3.5" aria-hidden="true" />
              Owed to me
              <CountBadge n={directionCounts.lent} />
            </TabsTrigger>
            <TabsTrigger
              value="borrowed"
              className="flex-1 gap-1.5 sm:flex-initial"
            >
              <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
              I owe
              <CountBadge n={directionCounts.borrowed} />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status filter tabs — full-width on mobile (4 equal columns), fits content on sm+ */}
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as StatusFilter)}
          className="w-full"
        >
          <TabsList className="w-full sm:w-fit ml-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All
              <CountBadge n={counts.all} />
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-initial">
              Pending
              <CountBadge n={counts.pending} />
            </TabsTrigger>
            <TabsTrigger value="partial" className="flex-1 sm:flex-initial">
              Partial
              <CountBadge n={counts.partial} />
            </TabsTrigger>
            <TabsTrigger value="paid" className="flex-1 sm:flex-initial">
              Paid
              <CountBadge n={counts.paid} />
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
              onEdit={(patch) => update.update({ id: loan.id, ...patch })}
              onDelete={() => del.remove(loan.id)}
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
  direction?: string | null;
  dueAt?: Date | string | null;
  notes?: string | null;
};

type EditLoanPatch = {
  debtor?: string;
  amount?: number;
  direction?: LoanDirection;
};

function LoanListItem({
  loan,
  onMarkPaid,
  onMarkPending,
  onRecordPayment,
  onEdit,
  onDelete,
}: {
  loan: LoanRow;
  onMarkPaid: () => void;
  onMarkPending: () => void;
  onRecordPayment: (amount: number) => void;
  onEdit: (patch: EditLoanPatch) => void;
  onDelete: () => void;
}) {
  const status = loan.status as LoanStatus;
  const direction = (loan.direction ?? "lent") as LoanDirection;
  const isBorrowed = direction === "borrowed";
  const isPaid = status === "paid";
  const remaining = Math.max(loan.amount - loan.amountPaid, 0);
  const progressPct =
    loan.amount > 0 ? Math.round((loan.amountPaid / loan.amount) * 100) : 0;
  const isBalanceHidden = useAtomValue(hideBalanceAtom);
  const maskAmount = (n: number) =>
    isBalanceHidden ? "$••••" : formatCurrency(n, "USD");

  return (
    <li className="flex flex-col gap-3 px-3 py-3 sm:px-4 sm:py-4">
      {/* Top row: debtor info + remaining */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-foreground truncate text-sm font-semibold capitalize sm:text-base">
              {loan.debtor}
            </span>
            <DirectionBadge direction={direction} />
            <StatusBadge status={status} />
          </div>
          <p className="text-muted-foreground flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-xs tabular-nums">
            <span>{maskAmount(loan.amount)} total</span>
            {loan.amountPaid > 0 && (
              <span className="before:mr-1.5 before:text-muted-foreground/50 before:content-['·']">
                <span className="text-foreground">
                  {maskAmount(loan.amountPaid)}
                </span>{" "}
                paid
              </span>
            )}
            {loan.dueAt && (
              <span className="before:mr-1.5 before:text-muted-foreground/50 before:content-['·']">
                due {new Date(loan.dueAt).toLocaleDateString()}
              </span>
            )}
          </p>
          {loan.notes && (
            <p className="text-muted-foreground flex items-start gap-1 text-xs italic">
              <FileTextIcon
                className="mt-0.5 size-3 shrink-0"
                aria-hidden="true"
              />
              <span className="line-clamp-2 sm:truncate">{loan.notes}</span>
            </p>
          )}
        </div>

        {!isPaid && remaining > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-foreground text-sm font-semibold tabular-nums sm:text-base">
              {maskAmount(remaining)}
            </p>
            <p className="text-muted-foreground text-[10px] sm:text-xs">
              {isBorrowed ? "to pay" : "remaining"}
            </p>
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
          className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
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

      {/* Action row — stacks on mobile, inline on sm+ */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {!isPaid && (
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-[260px]">
            <PartialPaymentControl onSubmit={onRecordPayment} />
          </div>
        )}
        <div className="flex items-center gap-2 sm:ml-auto">
          {!isPaid ? (
            <>
              <Button
                type="button"
                variant="default"
                onClick={onMarkPaid}
                className="flex-1 sm:flex-initial hidden sm:inline-flex"
              >
                <CheckCheck aria-hidden="true" />
                Mark paid
              </Button>

              <Button
                type="button"
                variant={"default"}
                onClick={onMarkPaid}
                className={"sm:hidden"}
                title="Mark paid"
              >
                <CheckCheck aria-hidden="true" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onMarkPending}
              className="flex-1 sm:flex-initial"
            >
              <RotateCcwIcon aria-hidden="true" />
              Reopen
            </Button>
          )}
          <EditLoanButton loan={loan} onSubmit={onEdit} />
          <DeleteLoanButton debtor={loan.debtor} onConfirm={onDelete} />
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

function DirectionBadge({ direction }: { direction: LoanDirection }) {
  const isBorrowed = direction === "borrowed";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 uppercase tracking-wide",
        isBorrowed
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-success/30 bg-success/10 text-success"
      )}
    >
      {isBorrowed ? (
        <ArrowUpRightIcon className="size-3" aria-hidden="true" />
      ) : (
        <ArrowDownLeftIcon className="size-3" aria-hidden="true" />
      )}
      {LOAN_DIRECTION_LABEL[direction]}
    </Badge>
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
        placeholder="Add payment"
        className="min-w-0 flex-1"
        aria-label="Partial payment amount"
      />
      <Button
        type="submit"
        variant="default"
        aria-label="Add partial payment"
        className="shrink-0"
        size={"icon"}
      >
        <BanknoteArrowUpIcon aria-hidden="true" />
      </Button>
    </form>
  );
}

function EditLoanButton({
  loan,
  onSubmit,
}: {
  loan: LoanRow;
  onSubmit: (patch: EditLoanPatch) => void;
}) {
  const [open, setOpen] = useState(false);
  const initialDirection = (loan.direction ?? "lent") as LoanDirection;
  const [debtor, setDebtor] = useState(loan.debtor);
  const [amount, setAmount] = useState(String(loan.amount));
  const [direction, setDirection] = useState<LoanDirection>(initialDirection);

  // When opening, hydrate from the latest loan values in case of upstream updates.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDebtor(loan.debtor);
      setAmount(String(loan.amount));
      setDirection((loan.direction ?? "lent") as LoanDirection);
    }
    setOpen(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    const patch: EditLoanPatch = {};
    const trimmed = debtor.trim();
    if (trimmed && trimmed !== loan.debtor) patch.debtor = trimmed;
    if (parsed !== loan.amount) patch.amount = parsed;
    if (direction !== initialDirection) patch.direction = direction;

    if (Object.keys(patch).length > 0) onSubmit(patch);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label={`Edit loan from ${loan.debtor}`}
                  className="text-muted-foreground hover:bg-accent shrink-0"
                >
                  <PencilIcon className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        />
        <TooltipContent side="top">Edit loan</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit loan</DialogTitle>
          <DialogDescription>
            Update the debtor, amount or direction. Status and payments stay
            untouched.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <Tabs
            value={direction}
            onValueChange={(v) => setDirection(v as LoanDirection)}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="lent" className="flex-1 gap-1.5">
                <ArrowDownLeftIcon className="size-3.5" aria-hidden="true" />{" "}
                Owed to me
              </TabsTrigger>
              <TabsTrigger value="borrowed" className="flex-1 gap-1.5">
                <ArrowUpRightIcon className="size-3.5" aria-hidden="true" /> I
                owe
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Field
            label={direction === "borrowed" ? "Creditor" : "Debtor"}
            icon={<UserIcon className="size-3.5" />}
          >
            <Input
              value={debtor}
              onChange={(e) => setDebtor(e.target.value)}
              autoComplete="off"
            />
          </Field>

          <Field
            label="Amount (USD)"
            icon={<CircleDollarSignIcon className="size-3.5" />}
          >
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteLoanButton({
  debtor,
  onConfirm,
}: {
  debtor: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger
          render={
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label={`Delete loan from ${debtor}`}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                >
                  <Trash2Icon className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        />
        <TooltipContent side="top">Delete loan</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete loan?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the loan record from{" "}
            <strong className="text-foreground capitalize">{debtor}</strong>.
            The originating transaction (if any) is kept intact. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
