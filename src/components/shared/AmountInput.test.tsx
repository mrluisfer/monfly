import { describe, expect, it } from "vitest";
import { evalAmount } from "./AmountInput";

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
