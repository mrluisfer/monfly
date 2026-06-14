import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { queryDictionary } from "~/queries/dictionary";
import { getUserSession } from "~/server/db/users/get-user-session";

export function HeaderActions() {
  const { data, isPending } = useQuery({
    queryKey: [queryDictionary.session],
    queryFn: () => getUserSession(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  const isAuthenticated = Boolean(data?.success && data?.data);

  if (isPending) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Skeleton className="h-11 w-24 rounded-full" />
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
    );
  }

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
