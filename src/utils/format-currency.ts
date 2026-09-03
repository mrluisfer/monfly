import type { DecimalConvention } from "./parse-number";

export type SupportedCurrency = "USD" | "MXN" | "EUR" | "GBP";

export interface CurrencyFormatOptions {
  /**
   * The user's separator convention, from their Settings → Regional choice.
   * Omitted, the currency's own locale decides — which is what `auto` means,
   * so callers outside a React tree can leave it out and get today's output.
   */
  convention?: DecimalConvention;
  /** Overrides the locale a currency is normally written in. */
  locale?: string;
}

/** App-wide fallback currency when a user hasn't picked one in their profile. */
export const DEFAULT_CURRENCY: SupportedCurrency = "MXN";

export function formatCurrency(
  value: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  { locale, convention }: CurrencyFormatOptions = {},
): string {
  const formatter = new Intl.NumberFormat(
    locale ?? getLocaleFromCurrency(currency),
    {
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
    },
  );

  if (!convention) {
    return formatter.format(value);
  }

  // Swap only the separators, never the whole locale: formatting MXN with a
  // German locale would also move the symbol and rename it "MX$". The parts
  // API keeps the currency's own symbol, placement and spacing intact.
  const group = convention === "comma-decimal" ? "." : ",";
  const decimal = convention === "comma-decimal" ? "," : ".";
  return formatter
    .formatToParts(value)
    .map((part) => {
      if (part.type === "group") {
        return group;
      }
      if (part.type === "decimal") {
        return decimal;
      }
      return part.value;
    })
    .join("");
}

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  EUR: "€",
  GBP: "£",
  MXN: "$",
  USD: "$",
};

/** The bare symbol for a currency, for compact spots like chart axes. */
export function getCurrencySymbol(currency: SupportedCurrency = "USD"): string {
  return CURRENCY_SYMBOLS[currency] ?? "$";
}

/**
 * Like {@link formatCurrency}, but renders a masked placeholder (e.g. `$••••`)
 * when `hidden` is true — used to honor the "hide balances" toggle without each
 * caller re-implementing the masking. The sign is preserved so income/expense
 * direction still reads while the figure is concealed.
 */
export function maskCurrency(
  value: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  hidden = false,
  options: CurrencyFormatOptions = {},
): string {
  if (!hidden) {
    return formatCurrency(value, currency, options);
  }
  return `${getCurrencySymbol(currency)}••••`;
}

/** The locale whose number conventions this currency is written in. */
export function getLocaleFromCurrency(currency: SupportedCurrency): string {
  switch (currency) {
    case "USD":
      return "en-US";
    case "MXN":
      return "es-MX";
    case "EUR":
      return "de-DE"; // You can change this to “es-ES” if you prefer Spanish for EUR
    case "GBP":
      return "en-GB";
    default:
      return "en-US";
  }
}
