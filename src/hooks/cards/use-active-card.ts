import { useSearch } from "@tanstack/react-router";

/**
 * Reads the active card filter from the URL search params. Uses a non-strict
 * read so shared components (charts, balance, transactions list) can call it
 * regardless of which route they render under. Returns `undefined` when no
 * card is selected — i.e. the aggregate "all cards" view.
 */
export const useActiveCard = (): string | undefined => {
  const search = useSearch({ strict: false }) as { card?: string };
  return search.card;
};
