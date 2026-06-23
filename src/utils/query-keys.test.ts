import { describe, expect, it } from "vitest";

import { queryKeys } from "@/utils/query-keys";
import { queryDictionary } from "~/queries/dictionary";

const EMAIL = "user@example.com";
const CARD = "card-123";

describe("queryKeys cardId handling", () => {
  it("leaves the key unchanged when no card is active", () => {
    expect(queryKeys.transactions.byEmail(EMAIL)).toEqual([
      queryDictionary.transactions,
      EMAIL,
    ]);
  });

  it("appends cardId as the LAST segment when a card is active", () => {
    const key = queryKeys.transactions.byEmail(EMAIL, CARD);
    expect(key).toEqual([queryDictionary.transactions, EMAIL, CARD]);
    expect(key[key.length - 1]).toBe(CARD);
  });

  it("treats null/empty cardId as 'no card' (aggregate key identity stays)", () => {
    expect(queryKeys.transactions.byEmail(EMAIL, null)).toEqual(
      queryKeys.transactions.byEmail(EMAIL),
    );
  });
});

describe("queryKeys chart prefix invariant", () => {
  // The whole invalidation strategy relies on every chart key starting with
  // [charts, email] so a single prefix invalidation refreshes them all.
  const prefix = queryKeys.charts.all(EMAIL);

  const chartKeys = [
    queryKeys.charts.incomeExpense(EMAIL),
    queryKeys.charts.byCategory(EMAIL),
    queryKeys.charts.byMonth(EMAIL),
    queryKeys.charts.trending(EMAIL, "income"),
    queryKeys.charts.dailyActivity(EMAIL),
    // and their card-scoped variants
    queryKeys.charts.incomeExpense(EMAIL, CARD),
    queryKeys.charts.trending(EMAIL, "expense", CARD),
  ];

  it("every chart key starts with [charts, email]", () => {
    for (const key of chartKeys) {
      expect(key.slice(0, prefix.length)).toEqual([...prefix]);
    }
  });
});

describe("queryKeys loan/transaction shared prefixes", () => {
  it("debtor suggestions sit under the [loans, email] prefix", () => {
    const prefix = queryKeys.loans.all(EMAIL);
    expect(queryKeys.loans.debtors(EMAIL).slice(0, prefix.length)).toEqual([
      ...prefix,
    ]);
  });

  it("totalExpenses sits under the [transactions, email] prefix", () => {
    const prefix = queryKeys.transactions.byEmail(EMAIL);
    expect(
      queryKeys.transactions.totalExpenses(EMAIL).slice(0, prefix.length),
    ).toEqual([...prefix]);
  });
});
