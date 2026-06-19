import {CheckCheck, CheckIcon, FileTextIcon, RotateCcwIcon} from "lucide-react";
import {Button} from "~/components/ui/button";
import {type LoanDirection, type LoanStatus} from "~/constants/loan-status";
import {cn} from "~/lib/utils";

import {DeleteLoanButton} from "./DeleteLoanButton";
import {DirectionBadge} from "./DirectionBadge";
import {EditLoanButton} from "./EditLoanButton";
import {PartialPaymentControl} from "./PartialPaymentControl";
import {StatusBadge} from "./StatusBadge";
import type {EditLoanPatch, LoanRow} from "./types";
import {useMaskedAmount} from "./use-masked-amount";

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
  const maskAmount = useMaskedAmount();

  return (
    <li className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:gap-5 lg:px-7 lg:py-6">
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
              <span className="before:text-muted-foreground/50 before:mr-1.5 before:content-['·']">
                <span className="text-foreground">
                  {maskAmount(loan.amountPaid)}
                </span>{" "}
                paid
              </span>
            )}
            {loan.dueAt && (
              <span className="before:text-muted-foreground/50 before:mr-1.5 before:content-['·']">
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
              isPaid ? "bg-success" : "bg-primary",
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Action row — stacks on mobile, inline on sm+ */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {!isPaid && (
          <div className="w-full sm:w-auto sm:max-w-[260px] sm:flex-1">
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
                className="hidden flex-1 sm:inline-flex sm:flex-initial"
              >
                <CheckIcon aria-hidden="true" />
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
              className="flex-initial"
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
