import { HandCoinsIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type LoanBadgeProps = {
  /** `true` when the transaction is a payment applied to a loan, vs. the loan origin. */
  isPayment?: boolean;
  className?: string;
};

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
        "border-warning/30 bg-warning/10 text-warning-foreground dark:text-warning gap-1 text-[10px] tracking-wide uppercase",
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
