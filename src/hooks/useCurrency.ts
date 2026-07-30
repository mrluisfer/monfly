import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { maskCurrency } from "~/utils/format-currency";

/**
 * Single entry point for rendering money: `format` applies the user's currency
 * and honors the "hide balances" toggle, so no caller re-implements the mask.
 * `currency` and `isHidden` are there for the few spots that need the bare
 * symbol (chart axes) or hide something that isn't an amount (a leading sign).
 */
export function useCurrency() {
  const currency = usePreferredCurrency();
  const isHidden = useAtomValue(hideBalanceAtom);

  const format = useCallback(
    (amount: number) => maskCurrency(amount, currency, isHidden),
    [currency, isHidden],
  );

  return { format, currency, isHidden };
}
