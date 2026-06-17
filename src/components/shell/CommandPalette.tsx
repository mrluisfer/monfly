import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
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
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { cn } from "~/lib/utils";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import type { TransactionWithUser } from "~/types/TransactionWithUser";
import { maskCurrency } from "~/utils/format-currency";
import { queryKeys } from "~/utils/query-keys";
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

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CommandPaletteContext =
  React.createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx)
    throw new Error(
      "useCommandPalette must be used inside CommandPaletteProvider",
    );
  return ctx;
}

type ProviderProps = {
  children: React.ReactNode;
  /** Optional overrides — default to in-app navigation when not provided. */
  onOpenSettings?: () => void;
  onSignOut?: () => void;
  onAddTransaction?: () => void;
};

export function CommandPaletteProvider({
  children,
  onOpenSettings,
  onSignOut,
  onAddTransaction,
}: ProviderProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [hideBalance, setHideBalance] = useAtom(hideBalanceAtom);
  const isMac = useIsMac();
  const userEmail = useRouteUser();
  const currency = usePreferredCurrency();

  // Pull the latest few transactions, but only while the palette is open so we
  // don't fire a request on every page load. Shares the cached `[transactions,
  // email]` prefix, so add/delete mutations refresh it for free.
  const { data: recentData } = useQuery({
    queryKey: [...queryKeys.transactions.byEmail(userEmail), "recent", 6],
    queryFn: () =>
      getTransactionByEmailServer({ data: { email: userEmail, limit: 6 } }),
    enabled: open && !!userEmail,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
  const recentTransactions =
    (recentData as { data?: TransactionWithUser[] } | undefined)?.data ?? [];

  const toggle = React.useCallback(() => setOpen((v) => !v), []);

  React.useEffect(() => {
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
        if (isEditable) return;
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const runCommand = React.useCallback((cb: () => void) => {
    setOpen(false);
    requestAnimationFrame(cb);
  }, []);

  const go = React.useCallback(
    (to: string) => () => navigate({ to }),
    [navigate],
  );

  const addTransaction = onAddTransaction ?? go("/home/transactions");
  const openSettings = onOpenSettings ?? go("/user/settings");
  const signOut = onSignOut ?? go("/logout");

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
              <CommandItem
                value="add new transaction record expense income"
                keywords={["new", "create", "expense", "income", "record"]}
                onSelect={() => runCommand(addTransaction)}
              >
                <PlusCircleIcon />
                <span>Add transaction</span>
              </CommandItem>
              <CommandItem
                value={
                  hideBalance
                    ? "show balances reveal amounts"
                    : "hide balances mask amounts privacy"
                }
                keywords={["privacy", "mask", "amounts", "money", "eye"]}
                onSelect={() =>
                  runCommand(() => setHideBalance((prev) => !prev))
                }
              >
                {hideBalance ? <EyeIcon /> : <EyeOffIcon />}
                <span>{hideBalance ? "Show balances" : "Hide balances"}</span>
              </CommandItem>
              <CommandItem
                value="new card add payment method"
                keywords={["card", "new", "add", "payment", "wallet"]}
                onSelect={() => runCommand(go("/home/cards"))}
              >
                <CreditCardIcon />
                <span>New card</span>
              </CommandItem>
              <CommandItem
                value="new category add label tag"
                keywords={["category", "new", "add", "tag", "label"]}
                onSelect={() => runCommand(go("/home/categories"))}
              >
                <ListPlusIcon />
                <span>New category</span>
              </CommandItem>
              <CommandItem
                value="new loan add debt lend borrow"
                keywords={["loan", "new", "add", "debt", "lend", "borrow"]}
                onSelect={() => runCommand(go("/home/loans"))}
              >
                <HandCoinsIcon />
                <span>New loan</span>
              </CommandItem>
              <CommandItem
                value="toggle theme dark light appearance"
                keywords={["dark", "light", "mode", "appearance"]}
                onSelect={() => runCommand(toggleDarkMode)}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
                <span>Switch to {isDark ? "light" : "dark"} mode</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigate">
              {sidebarRoutes
                .filter((r) => !r.disabled)
                .map((route) => (
                  <CommandItem
                    key={route.url}
                    value={`go to ${route.title}`}
                    keywords={["open", "page", "navigate", route.title]}
                    onSelect={() => runCommand(go(route.url))}
                  >
                    <route.icon />
                    <span>{route.title}</span>
                    <CommandShortcut>
                      <ArrowRightIcon className="size-3" />
                    </CommandShortcut>
                  </CommandItem>
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
                    const description =
                      transaction.description || "No description";
                    return (
                      <CommandItem
                        key={transaction.id}
                        value={`recent ${description} ${transaction.category} ${transaction.id}`}
                        keywords={[
                          "recent",
                          "latest",
                          transaction.category,
                          description,
                        ]}
                        onSelect={() => runCommand(go("/home/transactions"))}
                      >
                        {isIncome ? (
                          <ArrowUpRightIcon className="text-primary" />
                        ) : (
                          <ArrowDownLeftIcon className="text-destructive" />
                        )}
                        <span className="truncate">{description}</span>
                        <CommandShortcut
                          className={cn(
                            "tabular-nums",
                            isIncome ? "text-primary" : "text-destructive",
                          )}
                        >
                          {isIncome ? "+" : "-"}
                          {maskCurrency(
                            transaction.amount,
                            currency,
                            hideBalance,
                          )}
                        </CommandShortcut>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />

            <CommandGroup heading="Preferences & account">
              <CommandItem
                value="appearance theme color font"
                keywords={["theme", "color", "font", "look", "customize"]}
                onSelect={() => runCommand(go("/user/theme"))}
              >
                <PaletteIcon />
                <span>Appearance &amp; theme</span>
              </CommandItem>
              <CommandItem
                value="settings preferences profile account"
                keywords={["profile", "account", "preferences", "currency"]}
                onSelect={() => runCommand(openSettings)}
              >
                <SettingsIcon />
                <span>Open settings</span>
              </CommandItem>
              <CommandItem
                value="change password security"
                keywords={["security", "credentials", "update password"]}
                onSelect={() =>
                  runCommand(go("/user/settings/change-password"))
                }
              >
                <KeyRoundIcon />
                <span>Change password</span>
              </CommandItem>
              <CommandItem
                value="sign out logout exit"
                keywords={["logout", "exit", "leave"]}
                onSelect={() => runCommand(signOut)}
              >
                <LogOutIcon />
                <span>Sign out</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Help">
              <CommandItem
                value="help support guide documentation"
                keywords={["support", "guide", "docs", "faq", "how to"]}
                onSelect={() => runCommand(go("/user/help"))}
              >
                <LifeBuoyIcon />
                <span>Help &amp; guides</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>

          <div className="text-muted-foreground border-border/60 flex items-center justify-between gap-3 border-t px-3 py-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <CornerDownLeftIcon className="size-3" aria-hidden="true" />
              to run
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-medium">
                {modKey} K
              </kbd>
              to toggle ·{" "}
              <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-medium">
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
