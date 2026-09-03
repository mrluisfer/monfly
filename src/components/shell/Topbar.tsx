import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { LoaderIcon, SearchIcon, UserIcon } from "lucide-react";
import { Fragment, useCallback } from "react";
import { useRouteUser } from "@/hooks";
import { getUserByEmailServer } from "@/lib/api/user/get-user-by-email";
import { queryDictionary } from "@/queries/dictionary";
import { SystemStatusBadge } from "~/components/header/badges/SystemStatus";
import { HideData } from "~/components/header/HideData";
import ToggleDarkMode from "~/components/settings/ToggleDarkMode";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useIsMac } from "~/hooks/ui/useIsMac";
import { cn } from "~/lib/utils";
import { useCommandPalette } from "./command-palette-context";

interface Crumb {
  title: string;
  url?: string;
}

// Friendly labels for the `/user/*` path segments. Anything not listed (e.g. a
// dynamic `$userId`) falls back to the profile page.
const USER_SEGMENT_TITLE: Record<string, string> = {
  "change-password": "Change password",
  help: "Help",
  settings: "Settings",
  theme: "Theme",
};

function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];

  if (segments[0] === "home" || segments[0] === "user") {
    crumbs.push({ title: "Home", url: "/home" });
  }

  if (segments[0] === "home" && segments.length > 1) {
    const sub = `/${segments.slice(0, 2).join("/")}`;
    const match = sidebarRoutes.find((r) => r.url === sub);
    crumbs.push({
      title: match?.title ?? prettify(segments[1]),
    });
  }

  if (segments[0] === "user") {
    const userSegments = segments.slice(1);

    // Profile (`/user/$userId`) or a bare `/user` — no further crumbs to add.
    if (userSegments.length === 0 || !(userSegments[0] in USER_SEGMENT_TITLE)) {
      crumbs.push({ title: "Profile" });
    } else {
      // Mirror the path so nested account pages read as a real hierarchy, e.g.
      // /user/settings/change-password → Home › Settings › Change password.
      userSegments.forEach((segment, index) => {
        const isLast = index === userSegments.length - 1;
        crumbs.push({
          title: USER_SEGMENT_TITLE[segment] ?? prettify(segment),
          url: isLast
            ? undefined
            : `/user/${userSegments.slice(0, index + 1).join("/")}`,
        });
      });
    }
  }

  return crumbs;
}

function prettify(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Topbar() {
  const location = useLocation();
  const crumbs = buildBreadcrumbs(location.pathname);
  const { setOpen } = useCommandPalette();
  const isMac = useIsMac();
  const modKey = isMac ? "⌘" : "Ctrl";

  const userEmail = useRouteUser();
  const { data, isPending } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.user, userEmail],
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
  const user = data?.data;

  const handleSetIsOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-border/60 border-b bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/65",
        "md:px-4",
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <SidebarTrigger
              className="-ml-1 shrink-0"
              aria-label="Toggle navigation"
            />
          }
        />
        <TooltipContent side="bottom">
          Toggle navigation{" "}
          <KbdGroup>
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd> +<Kbd>b</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mr-1 data-[orientation=vertical]:h-full"
      />

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <Fragment key={`${crumb.title}-${crumb?.url}`}>
                {idx > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem className="min-w-0">
                  {isLast || !crumb.url ? (
                    <BreadcrumbPage className="truncate font-medium text-foreground">
                      {crumb.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      className="truncate"
                      render={<Link to={crumb.url}>{crumb.title}</Link>}
                    />
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="hidden items-center gap-2 lg:flex">
          <SystemStatusBadge
            compact
            variant="outline"
            isActive
            className="max-w-37.5"
            showIcon={false}
          />
        </div>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size={"lg"}
                onClick={handleSetIsOpen}
                aria-label="Search or run a command"
                aria-keyshortcuts={`${isMac ? "Meta" : "Control"}+K`}
                className="hidden min-w-44 gap-2 border-border/70 text-muted-foreground hover:text-foreground sm:inline-flex"
              />
            }
          >
            <SearchIcon className="size-4" aria-hidden="true" />
            <span className="text-xs">Search...</span>
            <Kbd className="ml-auto">
              <span aria-hidden="true">{modKey}</span>K
            </Kbd>
          </TooltipTrigger>
          <TooltipContent side="bottom">Command palette</TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="icon-lg"
          onClick={handleSetIsOpen}
          aria-label="Open command palette"
          aria-keyshortcuts={`${isMac ? "Meta" : "Control"}+K`}
          className="sm:hidden"
        >
          <SearchIcon className="size-4" aria-hidden="true" />
        </Button>

        <HideData />
        <ToggleDarkMode />
        <Button
          size={"icon-lg"}
          variant={"outline"}
          disabled={isPending || !user?.id}
          render={
            <Link to="/user/$userId" params={{ userId: user?.id ?? "" }} />
          }
        >
          {isPending ? <LoaderIcon className="animate-spin" /> : <UserIcon />}
        </Button>
      </div>
    </header>
  );
}
