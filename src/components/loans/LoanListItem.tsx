import { CheckIcon, FileTextIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import type { LoanDirection, LoanStatus } from "~/constants/loan-status";
import { useCurrency } from "~/hooks/useCurrency";
import { cn } from "~/lib/utils";
import { DeleteLoanButton } from "./DeleteLoanButton";
import { DirectionBadge } from "./DirectionBadge";
import { EditLoanButton } from "./EditLoanButton";
import { PartialPaymentControl } from "./PartialPaymentControl";
import { ReopenLoanButton } from "./ReopenLoanButton";
import { StatusBadge } from "./StatusBadge";
import type { EditLoanPatch, LoanRow } from "./types";

/** A single loan: identity, progress and per-row actions. */
export function LoanListItem({
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
  const { format: formatAmount } = useCurrency();

  return (
    <li className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:px-6 sm:py-5 lg:px-4 lg:py-4 xl:gap-5 xl:px-7 xl:py-6">
      {/* Status fades: green when paid, red while there's still a balance. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-linear-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90",
          isPaid
            ? "from-success/15 to-transparent"
            : "from-destructive/15 to-transparent",
        )}
      />
      {/* Top row: debtor info + remaining */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-semibold text-foreground text-sm capitalize sm:text-base">
              {loan.debtor}
            </span>
            <DirectionBadge direction={direction} />
            <StatusBadge status={status} />
            {status === "partial" && (
              <span className="font-medium text-warning text-xs tabular-nums">
                {progressPct}%
              </span>
            )}
          </div>
          <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-muted-foreground text-xs tabular-nums sm:text-sm">
            <span>
              <span className="font-medium text-foreground">
                {formatAmount(loan.amount)}
              </span>{" "}
              total
            </span>
            {loan.amountPaid > 0 && (
              <span className="before:mr-1.5 before:text-muted-foreground/50 before:content-['·']">
                <span className="font-medium text-foreground">
                  {formatAmount(loan.amountPaid)}
                </span>{" "}
                paid
              </span>
            )}
            {loan.issuedAt ? (
              <span className="before:mr-1.5 before:text-muted-foreground/50 before:content-['·']">
                issued{" "}
                <span className="text-foreground">
                  {new Date(loan.issuedAt).toLocaleDateString()}
                </span>
              </span>
            ) : null}
            {loan.dueAt ? (
              <span className="before:mr-1.5 before:text-muted-foreground/50 before:content-['·']">
                due{" "}
                <span className="text-foreground">
                  {new Date(loan.dueAt).toLocaleDateString()}
                </span>
              </span>
            ) : null}
          </p>
          {loan.notes ? (
            <p className="flex items-start gap-1 text-muted-foreground text-xs italic">
              <FileTextIcon
                className="mt-0.5 size-3 shrink-0"
                aria-hidden="true"
              />
              <span className="line-clamp-2 sm:truncate">{loan.notes}</span>
            </p>
          ) : null}
        </div>

        {!isPaid && remaining > 0 && (
          <div className="shrink-0 text-right">
            <p className="font-semibold text-foreground text-sm tabular-nums sm:text-base">
              {formatAmount(remaining)}
            </p>
            <p className="text-[10px] text-muted-foreground sm:text-xs">
              {isBorrowed ? "to pay" : "remaining"}
            </p>
          </div>
        )}
      </div>

      {/* Action row — stacks on mobile, inline on sm+; sticks to the card bottom
          so grid rows with uneven content stay aligned. */}
      <div className="relative mt-auto flex flex-col gap-2 sm:flex-row sm:items-center">
        {!isPaid && (
          <div className="w-full sm:w-auto sm:max-w-[260px] sm:flex-1">
            <PartialPaymentControl onSubmit={onRecordPayment} />
          </div>
        )}
        <div className="flex items-center gap-2 sm:ml-auto">
          {isPaid ? (
            <ReopenLoanButton debtor={loan.debtor} onConfirm={onMarkPending} />
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="default"
                    onClick={onMarkPaid}
                    size={"icon"}
                  />
                }
              >
                <CheckIcon aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Mark paid</TooltipContent>
            </Tooltip>
          )}
          <EditLoanButton loan={loan} onSubmit={onEdit} />
          <DeleteLoanButton debtor={loan.debtor} onConfirm={onDelete} />
        </div>
      </div>
    </li>
  );
}
