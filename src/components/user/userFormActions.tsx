import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface UserFormActionsProps {
  submitting: boolean;
  hasChanges: boolean;
}

export function UserFormActions({
  submitting,
  hasChanges,
}: UserFormActionsProps) {
  return (
    <div className="grid gap-3 border-t pt-4 sm:flex sm:items-end sm:justify-between">
      <div className="order-2 sm:order-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="destructive"
                type="button"
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            }
          />
          <TooltipContent sideOffset={8}>
            This action will permanently delete your account and all associated
            data.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="order-1 flex flex-col gap-2 sm:order-2 sm:items-end">
        <p className="text-xs text-muted-foreground sm:text-right">
          {hasChanges ? "You have unsaved changes." : "No changes to save."}
        </p>
        <Button
          type="submit"
          className="w-full sm:min-w-40 sm:w-auto"
          disabled={submitting || !hasChanges}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}
