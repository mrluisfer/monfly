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
