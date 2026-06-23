import { RotateCcwIcon } from "lucide-react";
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
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

/** Confirmation dialog that reopens a paid loan by reversing its payments. */
export function ReopenLoanButton({
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
                  aria-label={`Reopen loan from ${debtor}`}
                  className="shrink-0"
                >
                  <RotateCcwIcon className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        />
        <TooltipContent side="top">Reopen loan</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reopen loan?</AlertDialogTitle>
          <AlertDialogDescription>
            This reverses every payment recorded for{" "}
            <strong className="text-foreground capitalize">{debtor}</strong>,
            deleting those transactions and restoring the amounts to your
            balance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Reopen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
