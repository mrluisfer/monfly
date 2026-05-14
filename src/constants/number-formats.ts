export type NumberFormatId = "auto" | "dot-decimal" | "comma-decimal";

export type NumberFormatOption = {
  id: NumberFormatId;
  label: string;
  description: string;
  example: string;
};

export const NUMBER_FORMAT_OPTIONS: NumberFormatOption[] = [
  {
    id: "auto",
    label: "Auto detect",
    description: "Infer the decimal separator from each pasted value.",
    example: "1,234.56 / 1.234,56",
  },
  {
    id: "dot-decimal",
    label: "1,234.56 (US, UK, MX)",
    description: "Comma as thousands separator, period as decimal.",
    example: "1,234.56",
  },
  {
    id: "comma-decimal",
    label: "1.234,56 (EU, LATAM)",
    description: "Period as thousands separator, comma as decimal.",
    example: "1.234,56",
  },
];

export const DEFAULT_NUMBER_FORMAT: NumberFormatId = "auto";
