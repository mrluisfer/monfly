export const CARD_STATUSES = ["active", "archived"] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

export const CARD_STATUS_LABEL: Record<CardStatus, string> = {
  active: "Active",
  archived: "Archived",
};

export const CARD_TYPES = ["debit", "credit", "cash", "other"] as const;
export type CardType = (typeof CARD_TYPES)[number];

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  debit: "Debit",
  credit: "Credit",
  cash: "Cash",
  other: "Other",
};

/**
 * Optional accent colors a user can assign to a card. Used by the card list
 * accent bar and the balance-distribution chart. Values are plain CSS colors
 * so they work both as Tailwind inline styles and as chart fills.
 */
export const CARD_COLORS = [
  "#6366f1", // indigo
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#14b8a6", // teal
] as const;

/** Fallback palette (theme chart vars) cycled when a card has no custom color. */
export const CARD_FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;
