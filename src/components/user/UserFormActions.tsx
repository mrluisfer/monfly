import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface UserFormActionsProps {
  submitting: boolean;
}

export function UserFormActions({ submitting }: UserFormActionsProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" type="button">
            Delete Account
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          This action will permanently delete your account and all associated
          data.
        </TooltipContent>
      </Tooltip>

      <Button type="submit" className="px-6" disabled={submitting}>
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
  );
}
