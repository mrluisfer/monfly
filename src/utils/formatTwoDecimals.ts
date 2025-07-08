export function formatToTwoDecimals(value: number | string): {
  stringValue: string;
  numberValue: number;
} {
  if (value === "" || value === null || value === undefined)
    return {
      stringValue: "",
      numberValue: 0,
    };
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num))
    return {
      stringValue: "",
      numberValue: 0,
    };
  const numFixed = num.toFixed(2);
  return {
    stringValue: numFixed,
    numberValue: parseFloat(numFixed),
  };
}

export function formatToTwoDecimalsWithCurrency(
  value: number | string,
  currencySymbol: string = "$"
): string {
  const formattedValue = formatToTwoDecimals(value);
  return formattedValue ? `${currencySymbol}${formattedValue}` : "";
}
