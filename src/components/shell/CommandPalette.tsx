import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import {
  ArrowDownLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CornerDownLeftIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  HandCoinsIcon,
  KeyRoundIcon,
  LifeBuoyIcon,
  ListPlusIcon,
  LogOutIcon,
  MoonIcon,
  PaletteIcon,
  PlusCircleIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";

import type { ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useDarkMode } from "~/hooks/ui/useDarkMode";
import { useIsMac } from "~/hooks/ui/useIsMac";
import { useCurrency } from "~/hooks/useCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { cn } from "~/lib/utils";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import type { TransactionWithUser } from "~/types/TransactionWithUser";
import { queryKeys } from "~/utils/query-keys";
import { getTransactionTitle } from "~/utils/transaction-title";
import { CommandPaletteContext } from "./command-palette-context";

interface ProviderProps {
  children: ReactNode;
  onAddTransaction?: () => void;
  /** Optional overrides — default to in-app navigation when not provided. */
  onOpenSettings?: () => void;
  onSignOut?: () => void;
}

/**
 * A palette entry that closes the dialog and then runs its action. Binding
 * happens here so each call site passes the action itself, not a new closure.
 */
function CommandAction({
  run,
  action,
  children,
  ...props
}: ComponentProps<typeof CommandItem> & {
  run: (cb: () => void) => void;
  action: () => void;
}) {
  const onSelect = useCallback(() => run(action), [run, action]);

  return (
    <CommandItem onSelect={onSelect} {...props}>
      {children}
    </CommandItem>
  );
}

export function CommandPaletteProvider({
  children,
  onOpenSettings,
  onSignOut,
  onAddTransaction,
}: ProviderProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [hideBalance, setHideBalance] = useAtom(hideBalanceAtom);
  const isMac = useIsMac();
  const userEmail = useRouteUser();
  const { format: formatAmount } = useCurrency();

  // Pull the latest few transactions, but only while the palette is open so we
  // don't fire a request on every page load. Shares the cached `[transactions,
  // email]` prefix, so add/delete mutations refresh it for free.
  const { data: recentData } = useQuery({
    enabled: open && !!userEmail,
    gcTime: 1000 * 60 * 5,
    queryFn: () =>
      getTransactionByEmailServer({ data: { email: userEmail, limit: 6 } }),
    queryKey: [...queryKeys.transactions.byEmail(userEmail), "recent", 6],
    staleTime: 1000 * 60,
  });
  const recentTransactions =
    (recentData as { data?: TransactionWithUser[] } | undefined)?.data ?? [];

  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Cmd/Ctrl+K toggles the palette from anywhere
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" opens the palette unless the user is typing in a field
      if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName;
        const isEditable =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target?.isContentEditable;
        if (isEditable) {
          return;
        }
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const runCommand = useCallback((cb: () => void) => {
    setOpen(false);
    requestAnimationFrame(cb);
  }, []);

  const go = useCallback((to: string) => () => navigate({ to }), [navigate]);

  const addTransaction = onAddTransaction ?? go("/home/transactions");
  const openSettings = onOpenSettings ?? go("/user/settings");
  const signOut = onSignOut ?? go("/logout");

  const toggleHideBalance = useCallback(
    () => setHideBalance((prev) => !prev),
    [setHideBalance],
  );

  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search pages, run quick actions, and change preferences."
      >
        <Command label="Command palette" loop>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>
              No matches. Try a page name, “add transaction”, or “theme”.
            </CommandEmpty>

            <CommandGroup heading="Quick actions">
              <CommandAction
                value="add new transaction record expense income"
                keywords={["new", "create", "expense", "income", "record"]}
                run={runCommand}
                action={addTransaction}
              >
                <PlusCircleIcon />
                <span>Add transaction</span>
              </CommandAction>
              <CommandAction
                value={
                  hideBalance
                    ? "show balances reveal amounts"
                    : "hide balances mask amounts privacy"
                }
                keywords={["privacy", "mask", "amounts", "money", "eye"]}
                run={runCommand}
                action={toggleHideBalance}
              >
                {hideBalance ? <EyeIcon /> : <EyeOffIcon />}
                <span>{hideBalance ? "Show balances" : "Hide balances"}</span>
              </CommandAction>
              <CommandAction
                value="new card add payment method"
                keywords={["card", "new", "add", "payment", "wallet"]}
                run={runCommand}
                action={go("/home/cards")}
              >
                <CreditCardIcon />
                <span>New card</span>
              </CommandAction>
              <CommandAction
                value="new category add label tag"
                keywords={["category", "new", "add", "tag", "label"]}
                run={runCommand}
                action={go("/home/categories")}
              >
                <ListPlusIcon />
                <span>New category</span>
              </CommandAction>
              <CommandAction
                value="new loan add debt lend borrow"
                keywords={["loan", "new", "add", "debt", "lend", "borrow"]}
                run={runCommand}
                action={go("/home/loans")}
              >
                <HandCoinsIcon />
                <span>New loan</span>
              </CommandAction>
              <CommandAction
                value="toggle theme dark light appearance"
                keywords={["dark", "light", "mode", "appearance"]}
                run={runCommand}
                action={toggleDarkMode}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
                <span>Switch to {isDark ? "light" : "dark"} mode</span>
              </CommandAction>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigate">
              {sidebarRoutes
                .filter((r) => !r.disabled)
                .map((route) => (
                  <CommandAction
                    key={route.url}
                    value={`go to ${route.title}`}
                    keywords={["open", "page", "navigate", route.title]}
                    run={runCommand}
                    action={go(route.url)}
                  >
                    <route.icon />
                    <span>{route.title}</span>
                    <CommandShortcut>
                      <ArrowRightIcon className="size-3" />
                    </CommandShortcut>
                  </CommandAction>
                ))}
            </CommandGroup>

            <CommandSeparator />

            {recentTransactions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recent transactions">
                  {recentTransactions.map((transaction) => {
                    const isIncome =
                      transaction.type.toLowerCase() === "income";
                    const title = getTransactionTitle(
                      transaction.description,
                      transaction.category,
                    );
                    return (
                      <CommandAction
                        key={transaction.id}
                        value={`recent ${title} ${transaction.category} ${transaction.id}`}
                        keywords={[
                          "recent",
                          "latest",
                          transaction.category,
                          title,
                        ]}
                        run={runCommand}
                        action={go("/home/transactions")}
                      >
                        {isIncome ? (
                          <ArrowUpRightIcon className="text-primary" />
                        ) : (
                          <ArrowDownLeftIcon className="text-destructive" />
                        )}
                        <span className="truncate">{title}</span>
                        <CommandShortcut
                          className={cn(
                            "tabular-nums",
                            isIncome ? "text-primary" : "text-destructive",
                          )}
                        >
                          {isIncome ? "+" : "-"}
                          {formatAmount(transaction.amount)}
                        </CommandShortcut>
                      </CommandAction>
                    );
                  })}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />

            <CommandGroup heading="Preferences & account">
              <CommandAction
                value="appearance theme color font"
                keywords={["theme", "color", "font", "look", "customize"]}
                run={runCommand}
                action={go("/user/theme")}
              >
                <PaletteIcon />
                <span>Appearance &amp; theme</span>
              </CommandAction>
              <CommandAction
                value="settings preferences profile account"
                keywords={["profile", "account", "preferences", "currency"]}
                run={runCommand}
                action={openSettings}
              >
                <SettingsIcon />
                <span>Open settings</span>
              </CommandAction>
              <CommandAction
                value="change password security"
                keywords={["security", "credentials", "update password"]}
                run={runCommand}
                action={go("/user/settings/change-password")}
              >
                <KeyRoundIcon />
                <span>Change password</span>
              </CommandAction>
              <CommandAction
                value="sign out logout exit"
                keywords={["logout", "exit", "leave"]}
                run={runCommand}
                action={signOut}
              >
                <LogOutIcon />
                <span>Sign out</span>
              </CommandAction>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Help">
              <CommandAction
                value="help support guide documentation"
                keywords={["support", "guide", "docs", "faq", "how to"]}
                run={runCommand}
                action={go("/user/help")}
              >
                <LifeBuoyIcon />
                <span>Help &amp; guides</span>
              </CommandAction>
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between gap-3 border-border/60 border-t px-3 py-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CornerDownLeftIcon className="size-3" aria-hidden="true" />
              to run
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-medium text-muted-foreground">
                {modKey} K
              </kbd>
              to toggle ·{" "}
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-medium text-muted-foreground">
                esc
              </kbd>
              to close
            </span>
          </div>
        </Command>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
