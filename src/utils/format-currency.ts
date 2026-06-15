export type SupportedCurrency = "USD" | "MXN" | "EUR" | "GBP";

/** App-wide fallback currency when a user hasn't picked one in their profile. */
export const DEFAULT_CURRENCY: SupportedCurrency = "MXN";

export function formatCurrency(
  value: number,
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  locale?: string,
): string {
  const resolvedLocale = locale ?? getLocaleFromCurrency(currency);
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: "$",
  MXN: "$",
  EUR: "€",
  GBP: "£",
};

/** The bare symbol for a currency, for compact spots like chart axes. */
export function getCurrencySymbol(currency: SupportedCurrency = "USD"): string {
  return CURRENCY_SYMBOLS[currency] ?? "$";
}

function getLocaleFromCurrency(currency: SupportedCurrency): string {
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
