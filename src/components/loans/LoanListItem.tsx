import {CheckIcon, FileTextIcon} from "lucide-react";
import {Button} from "~/components/ui/button";
import {type LoanDirection, type LoanStatus} from "~/constants/loan-status";
import {cn} from "~/lib/utils";

import {DeleteLoanButton} from "./DeleteLoanButton";
import {DirectionBadge} from "./DirectionBadge";
import {EditLoanButton} from "./EditLoanButton";
import {PartialPaymentControl} from "./PartialPaymentControl";
import {ReopenLoanButton} from "./ReopenLoanButton";
import {StatusBadge} from "./StatusBadge";
import type {EditLoanPatch, LoanRow} from "./types";
import {useMaskedAmount} from "./use-masked-amount";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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
    <li
      className="group bg-card border-border/60 relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-4 shadow-xs transition-shadow hover:shadow-md sm:px-6 sm:py-5 lg:gap-5 lg:px-7 lg:py-6">
      {/* Status fades: green when paid, red while there's still a balance. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90",
          isPaid ? "from-success/15 to-transparent" : "from-destructive/15 to-transparent",
        )}
      />
      {/* Top row: debtor info + remaining */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-foreground truncate text-sm font-semibold capitalize sm:text-base">
              {loan.debtor}
            </span>
            <DirectionBadge direction={direction}/>
            <StatusBadge status={status}/>
            {status === "partial" && (
              <span className="text-warning text-xs font-medium tabular-nums">
                {progressPct}%
              </span>
            )}
          </div>
          <p
            className="text-muted-foreground flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-xs tabular-nums sm:text-sm">
            <span>
              <span className="text-foreground font-medium">
                {maskAmount(loan.amount)}
              </span>{" "}
              total
            </span>
            {loan.amountPaid > 0 && (
              <span className="before:text-muted-foreground/50 before:mr-1.5 before:content-['·']">
                <span className="text-foreground font-medium">
                  {maskAmount(loan.amountPaid)}
                </span>{" "}
                paid
              </span>
            )}
            {loan.issuedAt && (
              <span className="before:text-muted-foreground/50 before:mr-1.5 before:content-['·']">
                issued{" "}
                <span className="text-foreground">
                  {new Date(loan.issuedAt).toLocaleDateString()}
                </span>
              </span>
            )}
            {loan.dueAt && (
              <span className="before:text-muted-foreground/50 before:mr-1.5 before:content-['·']">
                due{" "}
                <span className="text-foreground">
                  {new Date(loan.dueAt).toLocaleDateString()}
                </span>
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

      {/* Action row — stacks on mobile, inline on sm+ */}
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center">
        {!isPaid && (
          <div className="w-full sm:w-auto sm:max-w-[260px] sm:flex-1">
            <PartialPaymentControl onSubmit={onRecordPayment}/>
          </div>
        )}
        <div className="flex items-center gap-2 sm:ml-auto">
          {!isPaid ? (
            <Tooltip>
              <TooltipTrigger render={<Button
                type="button"
                variant="default"
                onClick={onMarkPaid}
                size={'icon'}
              ></Button>}>
                <CheckIcon aria-hidden="true"/>
              </TooltipTrigger>
              <TooltipContent>
                Mark paid
              </TooltipContent>
            </Tooltip>
          ) : (
            <ReopenLoanButton debtor={loan.debtor} onConfirm={onMarkPending} />
          )}
          <EditLoanButton loan={loan} onSubmit={onEdit}/>
          <DeleteLoanButton debtor={loan.debtor} onConfirm={onDelete}/>
        </div>
      </div>
    </li>
  );
}
