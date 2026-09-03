export function formatToTwoDecimals(
  value: number | string | null | undefined,
): {
  stringValue: string;
  numberValue: number;
} {
  if (value === "" || value === null || value === undefined) {
    return {
      numberValue: 0,
      stringValue: "",
    };
  }
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) {
    return {
      numberValue: 0,
      stringValue: "",
    };
  }
  const numFixed = num.toFixed(2);
  return {
    numberValue: Number.parseFloat(numFixed),
    stringValue: numFixed,
  };
}

export function formatToTwoDecimalsWithCurrency(
  value: number | string,
  currencySymbol = "$",
): string {
  const { stringValue } = formatToTwoDecimals(value);
  return stringValue ? `${currencySymbol}${stringValue}` : "";
}
