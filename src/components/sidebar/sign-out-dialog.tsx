import { ReactNode } from "react";
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

export const SignOutDialog = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logoutFn({
      data: { destination: "/login", manualRedirect: true },
    });
    await navigate({
      to: "/login",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogOut}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
