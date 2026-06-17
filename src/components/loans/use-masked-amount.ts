import { useAtomValue } from "jotai";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { maskCurrency } from "~/utils/format-currency";

/**
 * Returns a formatter that renders an amount in the user's preferred currency,
 * masked (e.g. `$••••`) while the "hide balances" toggle is on. Shared by the
 * list and each row so the masking rule lives in one place.
 */
export function useMaskedAmount() {
  const currency = usePreferredCurrency();
  const isBalanceHidden = useAtomValue(hideBalanceAtom);
  return (amount: number) => maskCurrency(amount, currency, isBalanceHidden);
}
