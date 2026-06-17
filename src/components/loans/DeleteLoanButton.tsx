import { Trash2Icon } from "lucide-react";
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

/** Confirmation dialog that deletes a loan (the origin transaction is kept). */
export function DeleteLoanButton({
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
