export type NumberFormatId = "auto" | "dot-decimal" | "comma-decimal";

export interface NumberFormatOption {
  description: string;
  example: string;
  id: NumberFormatId;
  label: string;
}

export const NUMBER_FORMAT_OPTIONS: NumberFormatOption[] = [
  {
    description: "Follow the conventions of your display currency.",
    example: "1,234.56 / 1.234,56",
    id: "auto",
    label: "Match my currency",
  },
  {
    description: "Comma as thousands separator, period as decimal.",
    example: "1,234.56",
    id: "dot-decimal",
    label: "1,234.56 (US, UK, MX)",
  },
  {
    description: "Period as thousands separator, comma as decimal.",
    example: "1.234,56",
    id: "comma-decimal",
    label: "1.234,56 (EU, LATAM)",
  },
];

export const DEFAULT_NUMBER_FORMAT: NumberFormatId = "auto";
