/**
 * Headline text for a transaction in lists and pickers.
 *
 * The description is optional, and a bare "No description" told the user
 * nothing about what the money went to. Falling back to the category keeps the
 * row scannable — it still names the kind of expense. "No description" stays as
 * the last resort for rows that carry neither.
 */
export const getTransactionTitle = (
  description: string | null | undefined,
  category: string | null | undefined,
): string => description?.trim() || category?.trim() || "No description";
