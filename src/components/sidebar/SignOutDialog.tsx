import { ReactElement, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { logoutFn } from "~/server/auth/logoutfn";
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
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      await logoutFn({
        data: { destination: "/login", manualRedirect: true },
      });
      // Clear the cached session context so the header/sidebar re-evaluate as
      // logged out, then navigate to the login screen.
      await router.invalidate();
      await navigate({
        to: "/login",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  // If open/onOpenChange are provided, use controlled mode
  // Otherwise, use uncontrolled mode for backward compatibility
  const isControlled = open !== undefined && onOpenChange !== undefined;

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
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogOut}
            disabled={isSigningOut}
            variant="destructive"
          >
            {isSigningOut ? "Signing out..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
