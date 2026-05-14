import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
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
import {
  ArrowRightIcon,
  LogOutIcon,
  MoonIcon,
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
  const { theme, setTheme } = useDarkMode();

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

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command label="Command palette" loop>
          <CommandInput placeholder="Search or run a command…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Navigate">
              {sidebarRoutes
                .filter((r) => !r.disabled)
                .map((route) => (
                  <CommandItem
                    key={route.url}
                    value={`go ${route.title}`}
                    onSelect={() =>
                      runCommand(() => navigate({ to: route.url }))
                    }
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

            <CommandGroup heading="Actions">
              {onAddTransaction && (
                <CommandItem
                  value="add transaction new"
                  onSelect={() => runCommand(onAddTransaction)}
                >
                  <PlusCircleIcon />
                  <span>Add transaction</span>
                </CommandItem>
              )}
              {onOpenSettings && (
                <CommandItem
                  value="settings preferences"
                  onSelect={() => runCommand(onOpenSettings)}
                >
                  <SettingsIcon />
                  <span>Open settings</span>
                </CommandItem>
              )}
              <CommandItem
                value="theme dark light toggle"
                onSelect={() =>
                  runCommand(() =>
                    setTheme(theme === "dark" ? "light" : "dark"),
                  )
                }
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                <span>
                  Switch to {theme === "dark" ? "light" : "dark"} mode
                </span>
              </CommandItem>
              {onSignOut && (
                <CommandItem
                  value="sign out logout"
                  onSelect={() => runCommand(onSignOut)}
                >
                  <LogOutIcon />
                  <span>Sign out</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
