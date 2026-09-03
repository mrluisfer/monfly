import { describe, expect, it } from "vitest";
import {
  evalAmount,
  formatNumberForInput,
  parseFormattedNumber,
  resolveDecimalConvention,
} from "./parse-number";

describe("resolveDecimalConvention", () => {
  it("passes an explicit preference straight through", () => {
    expect(resolveDecimalConvention("dot-decimal", "de-DE")).toBe(
      "dot-decimal",
    );
    expect(resolveDecimalConvention("comma-decimal", "en-US")).toBe(
      "comma-decimal",
    );
  });

  it("resolves auto from the currency's locale", () => {
    expect(resolveDecimalConvention("auto", "es-MX")).toBe("dot-decimal");
    expect(resolveDecimalConvention("auto", "en-US")).toBe("dot-decimal");
    expect(resolveDecimalConvention("auto", "en-GB")).toBe("dot-decimal");
    expect(resolveDecimalConvention("auto", "de-DE")).toBe("comma-decimal");
  });

  it("falls back to dot-decimal for an unusable locale", () => {
    expect(resolveDecimalConvention("auto", "not a locale")).toBe(
      "dot-decimal",
    );
  });
});

describe("parseFormattedNumber", () => {
  it("reads a lone separator as the convention says", () => {
    // Comma groups, period is cents.
    expect(parseFormattedNumber("1,250", "dot-decimal")).toBe(1250);
    expect(parseFormattedNumber("1.250", "dot-decimal")).toBe(1.25);
    expect(parseFormattedNumber("12,500", "dot-decimal")).toBe(12_500);
    expect(parseFormattedNumber("1.25", "dot-decimal")).toBe(1.25);

    // And exactly the other way around.
    expect(parseFormattedNumber("1.250", "comma-decimal")).toBe(1250);
    expect(parseFormattedNumber("1,250", "comma-decimal")).toBe(1.25);
    expect(parseFormattedNumber("12.500", "comma-decimal")).toBe(12_500);
  });

  it("lets the rightmost separator win when both are present", () => {
    expect(parseFormattedNumber("1,234.56", "dot-decimal")).toBe(1234.56);
    expect(parseFormattedNumber("1.234,56", "comma-decimal")).toBe(1234.56);
    // A value pasted from the other side of the world still reads correctly:
    // a grouping separator can never sit right of the decimal one.
    expect(parseFormattedNumber("1.234,56", "dot-decimal")).toBe(1234.56);
    expect(parseFormattedNumber("1,234.56", "comma-decimal")).toBe(1234.56);
  });

  it("handles repeated grouping separators", () => {
    expect(parseFormattedNumber("1,234,567", "dot-decimal")).toBe(1_234_567);
    expect(parseFormattedNumber("1.234.567", "comma-decimal")).toBe(1_234_567);
  });

  it("keeps the sign and tolerates surrounding noise", () => {
    expect(parseFormattedNumber("-$1,200.00", "dot-decimal")).toBe(-1200);
    expect(parseFormattedNumber(" 42 MXN ", "dot-decimal")).toBe(42);
  });

  it("returns null when there is no number", () => {
    for (const bad of ["", "abc", "-", ".", ","]) {
      expect(parseFormattedNumber(bad, "dot-decimal")).toBeNull();
    }
  });
});

describe("formatNumberForInput", () => {
  it("groups thousands the way the user reads them", () => {
    expect(formatNumberForInput(1250, "dot-decimal")).toBe("1,250");
    expect(formatNumberForInput(1250, "comma-decimal")).toBe("1.250");
    expect(formatNumberForInput(1234.56, "dot-decimal")).toBe("1,234.56");
    expect(formatNumberForInput(1234.56, "comma-decimal")).toBe("1.234,56");
    expect(formatNumberForInput(42, "dot-decimal")).toBe("42");
  });

  it("never rounds the value away", () => {
    expect(formatNumberForInput(0.123_45, "dot-decimal")).toBe("0.12345");
  });

  it("round-trips through the parser", () => {
    for (const convention of ["dot-decimal", "comma-decimal"] as const) {
      for (const value of [0.5, 42, 1250, 1234.56, 9_876_543.21]) {
        expect(
          parseFormattedNumber(
            formatNumberForInput(value, convention),
            convention,
          ),
        ).toBe(value);
      }
    }
  });
});

describe("evalAmount", () => {
  it("evaluates numbers and arithmetic", () => {
    expect(evalAmount("42")).toBe(42);
    expect(evalAmount("12+20")).toBe(32);
    expect(evalAmount("1200 / 3")).toBe(400);
    expect(evalAmount("(10+5)*2")).toBe(30);
  });

  it("rejects incomplete, empty and non-arithmetic input", () => {
    for (const bad of ["", "12+", "abc", "alert(1)", "1/0", "12; drop"]) {
      expect(evalAmount(bad)).toBeNull();
    }
  });
});

describe("evalAmount under a decimal convention", () => {
  it("reads comma as grouping and period as cents", () => {
    expect(evalAmount("1,250", "dot-decimal")).toBe(1250);
    expect(evalAmount("1.250", "dot-decimal")).toBe(1.25);
    expect(evalAmount("1,200 + 50.5", "dot-decimal")).toBe(1250.5);
    expect(evalAmount("1,250.50", "dot-decimal")).toBe(1250.5);
  });

  it("reads period as grouping and comma as cents", () => {
    expect(evalAmount("1.250", "comma-decimal")).toBe(1250);
    expect(evalAmount("1,250", "comma-decimal")).toBe(1.25);
    expect(evalAmount("1.200 + 50,5", "comma-decimal")).toBe(1250.5);
    expect(evalAmount("12,5*2", "comma-decimal")).toBe(25);
  });

  it("adds up grouped operands", () => {
    expect(evalAmount("1,250 + 2,500", "dot-decimal")).toBe(3750);
  });

  it("still rejects anything that is not arithmetic", () => {
    for (const bad of ["alert(1)", "12; drop", "abc", "1/0"]) {
      expect(evalAmount(bad, "comma-decimal")).toBeNull();
    }
  });
});
