import { describe, expect, it } from "vitest";

import {
  formatToTwoDecimals,
  formatToTwoDecimalsWithCurrency,
} from "@/utils/formatTwoDecimals";

describe("formatToTwoDecimals", () => {
  it("formats numeric input to two decimals", () => {
    expect(formatToTwoDecimals(5)).toEqual({
      stringValue: "5.00",
      numberValue: 5,
    });
  });

  it("rounds to two decimals", () => {
    expect(formatToTwoDecimals(1.005)).toEqual({
      stringValue: "1.00", // float rounding — locks current behavior
      numberValue: 1,
    });
    expect(formatToTwoDecimals("2.349")).toEqual({
      stringValue: "2.35",
      numberValue: 2.35,
    });
  });

  it("parses numeric strings", () => {
    expect(formatToTwoDecimals("42")).toEqual({
      stringValue: "42.00",
      numberValue: 42,
    });
  });

  it("returns zeroed result for empty / nullish / non-numeric input", () => {
    const empty = { stringValue: "", numberValue: 0 };
    expect(formatToTwoDecimals("")).toEqual(empty);
    expect(formatToTwoDecimals(null as unknown as string)).toEqual(empty);
    expect(formatToTwoDecimals(undefined as unknown as string)).toEqual(empty);
    expect(formatToTwoDecimals("abc")).toEqual(empty);
  });
});

describe("formatToTwoDecimalsWithCurrency", () => {
  it("prefixes the formatted value with the currency symbol", () => {
    expect(formatToTwoDecimalsWithCurrency(5)).toBe("$5.00");
    expect(formatToTwoDecimalsWithCurrency("2.349", "€")).toBe("€2.35");
  });

  it("returns an empty string for empty / non-numeric input", () => {
    expect(formatToTwoDecimalsWithCurrency("")).toBe("");
    expect(formatToTwoDecimalsWithCurrency("abc")).toBe("");
  });
});
