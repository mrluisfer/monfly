import { createContext, useContext } from "react";

export interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const CommandPaletteContext =
  createContext<CommandPaletteContextValue | null>(null);

/**
 * Lives apart from `CommandPalette.tsx` on purpose. A module that exports both
 * a component and a hook is not a valid Fast Refresh boundary, so every edit to
 * it re-ran the module and handed out a brand-new context object while mounted
 * consumers still held the previous one — surfacing as a spurious
 * "must be used inside CommandPaletteProvider" during dev. Keeping the context
 * in a component-free module makes Vite reload its importers instead.
 */
export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used inside CommandPaletteProvider",
    );
  }
  return ctx;
}
