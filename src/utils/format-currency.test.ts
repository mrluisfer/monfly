import { describe, expect, it } from "vitest";

import {
  DEFAULT_CURRENCY,
  formatCurrency,
  getCurrencySymbol,
  maskCurrency,
} from "@/utils/format-currency";

describe("formatCurrency", () => {
  it("formats USD with grouping and two decimals", () => {
    expect(formatCurrency(1234.5, "USD")).toBe("$1,234.50");
  });

  it("always shows exactly two fraction digits", () => {
    expect(formatCurrency(5, "USD")).toBe("$5.00");
    expect(formatCurrency(5.999, "USD")).toBe("$6.00"); // rounds
  });

  it("preserves sign for negatives", () => {
    expect(formatCurrency(-42, "USD")).toBe("-$42.00");
  });

  it("defaults to MXN when no currency is given", () => {
    // Don't assert exact locale spacing — just that it uses the default symbol.
    expect(DEFAULT_CURRENCY).toBe("MXN");
    expect(formatCurrency(10)).toContain("10.00");
  });

  it("honors an explicit locale override", () => {
    expect(formatCurrency(1234.5, "EUR", "en-US")).toBe("€1,234.50");
  });
});

describe("getCurrencySymbol", () => {
  it("maps known currencies", () => {
    expect(getCurrencySymbol("EUR")).toBe("€");
    expect(getCurrencySymbol("GBP")).toBe("£");
    expect(getCurrencySymbol("USD")).toBe("$");
  });
});

describe("maskCurrency", () => {
  it("formats normally when not hidden", () => {
    expect(maskCurrency(1234.5, "USD", false)).toBe("$1,234.50");
  });

  it("masks the figure but keeps the symbol when hidden", () => {
    expect(maskCurrency(1234.5, "USD", true)).toBe("$••••");
    expect(maskCurrency(1234.5, "EUR", true)).toBe("€••••");
  });
});
