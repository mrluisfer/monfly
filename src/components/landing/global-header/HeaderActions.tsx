import { Link, useRouteContext } from "@tanstack/react-router";
import { ChevronRight, LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export function HeaderActions() {
  // Read the session straight from the router context (resolved in the root
  // beforeLoad). It's always settled by the time this renders, so there's no
  // loading flash and no separate, drift-prone session query.
  const { userEmail } = useRouteContext({ from: "__root__" });
  const isAuthenticated = Boolean(userEmail);

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="secondary"
          size="lg"
          render={
            <Link to="/signout" className="inline-flex items-center gap-1.5">
              <LogOutIcon />
              <span className="hidden sm:inline">Sign Out</span>
            </Link>
          }
        />
        <Button
          size="lg"
          render={
            <Link to="/home" className="inline-flex items-center gap-1.5">
              <LayoutDashboardIcon />
              <span className="hidden sm:inline">Go to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
              <ChevronRight />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="secondary"
        size="lg"
        render={
          <Link to="/login">
            Sign In <ChevronRight />
          </Link>
        }
      />
      <Button
        size="lg"
        render={
          <Link to="/signup" className="inline-flex items-center gap-1.5">
            <span className="hidden sm:inline">Create account</span>
            <span className="sm:hidden">Start</span>
            <ChevronRight />
          </Link>
        }
      />
    </div>
  );
}
