import { ReactElement, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { logoutFn } from "~/utils/auth/logoutfn";
import { CircleAlertIcon } from "lucide-react";

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
} from "../ui/alert-dialog";

interface SignOutDialogProps {
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SignOutDialog = ({
  children,
  open,
  onOpenChange,
}: SignOutDialogProps) => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    if (onOpenChange) {
      onOpenChange(false); // Close dialog first if controlled
    }

    try {
      await logoutFn({
        data: { destination: "/login", manualRedirect: true },
      });
      await navigate({
        to: "/login",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCancel = () => {
    if (isSigningOut) return;

    if (onOpenChange) {
      onOpenChange(false); // Only close if controlled
    }
  };

  // If open/onOpenChange are provided, use controlled mode
  // Otherwise, use uncontrolled mode for backward compatibility
  const isControlled = open !== undefined || onOpenChange !== undefined;

  return (
    <AlertDialog
      open={isControlled ? open : undefined}
      onOpenChange={isControlled ? onOpenChange : undefined}
    >
      {/* Only render trigger if children are provided */}
      {children && <AlertDialogTrigger render={children} />}
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? This will end your current
              session and redirect you to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="grid grid-cols-2 gap-3 pt-2 sm:flex sm:justify-end">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isSigningOut}
            className="w-full"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogOut}
            disabled={isSigningOut}
            variant="destructive"
            className="w-full"
          >
            {isSigningOut ? "Signing out..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
