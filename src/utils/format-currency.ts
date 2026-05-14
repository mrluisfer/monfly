type SupportedCurrency = "USD" | "MXN" | "EUR";

export function formatCurrency(
  value: number,
  currency: SupportedCurrency = "USD",
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

function getLocaleFromCurrency(currency: SupportedCurrency): string {
  switch (currency) {
    case "USD":
      return "en-US";
    case "MXN":
      return "es-MX";
    case "EUR":
      return "de-DE"; // You can change this to “es-ES” if you prefer Spanish for EUR
    default:
      return "en-US";
  }
}
