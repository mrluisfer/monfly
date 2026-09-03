import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { useDecimalConvention } from "~/hooks/ui/useDecimalConvention";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { hideBalanceAtom } from "~/state/atoms/ui/preferencesAtoms";
import { formatCurrency, maskCurrency } from "~/utils/format-currency";

/**
 * Single entry point for rendering money. Both formatters apply the user's
 * currency *and* their Settings → Regional separator convention, so an amount
 * reads the same in a chart tooltip as it does in the transaction form.
 *
 * `format` additionally honors the "hide balances" toggle; `formatPlain` never
 * masks, for the figures that stay visible (chart tooltips, badges) — pick the
 * one that matches what the surface should do when balances are hidden.
 *
 * `currency` and `isHidden` are there for the few spots that need the bare
 * symbol (chart axes) or hide something that isn't an amount (a leading sign).
 */
export function useCurrency() {
  const currency = usePreferredCurrency();
  const isHidden = useAtomValue(hideBalanceAtom);
  const convention = useDecimalConvention();

  const options = useMemo(() => ({ convention }), [convention]);

  const format = useCallback(
    (amount: number) => maskCurrency(amount, currency, isHidden, options),
    [currency, isHidden, options],
  );

  const formatPlain = useCallback(
    (amount: number) => formatCurrency(amount, currency, options),
    [currency, options],
  );

  return { currency, format, formatPlain, isHidden };
}
