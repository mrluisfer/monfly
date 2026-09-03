import { HandCoinsIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface LoanBadgeProps {
  className?: string;
  /** `true` when the transaction is a payment applied to a loan, vs. the loan origin. */
  isPayment?: boolean;
}

/**
 * Marks a transaction as loan-related. Built on the shadcn `Badge` (outline
 * variant) so it shares the system sizing/radius/focus and only layers on the
 * "warning" palette — there's no warning variant upstream, so we tint via
 * className rather than forking the primitive. Kept in one place so the table
 * and the mobile rows stay in sync.
 */
export function LoanBadge({ isPayment, className }: LoanBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-warning/30 bg-warning/10 text-[10px] text-warning-foreground uppercase tracking-wide dark:text-warning",
        className,
      )}
      title={
        isPayment
          ? "This transaction was applied as a payment to a loan"
          : "This transaction is tracked as a loan"
      }
    >
      <HandCoinsIcon aria-hidden="true" />
      {isPayment ? "Loan payment" : "Loan"}
    </Badge>
  );
}
