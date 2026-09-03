import { useMemo } from "react";

import { useNumberFormat } from "~/hooks/ui/useNumberFormat";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { getLocaleFromCurrency } from "~/utils/format-currency";
import {
  type DecimalConvention,
  resolveDecimalConvention,
} from "~/utils/parse-number";

/**
 * How this user writes `1,234.56` — their stored number-format preference,
 * with `auto` resolved against the locale of their display currency. Every
 * money input should read numbers through this so a comma means the same
 * thing in the calculator and in the transaction form.
 */
export function useDecimalConvention(): DecimalConvention {
  const { format } = useNumberFormat();
  const currency = usePreferredCurrency();

  return useMemo(
    () => resolveDecimalConvention(format, getLocaleFromCurrency(currency)),
    [format, currency],
  );
}
