import { describe, expect, it } from "vitest";

import { validLimitNumber } from "@/utils/valid-limit-number";

describe("validLimitNumber", () => {
  it("passes through partial inputs so the user can keep typing", () => {
    expect(validLimitNumber("")).toBe("");
    expect(validLimitNumber(".")).toBe(".");
  });

  it("returns the value when within the limit", () => {
    expect(validLimitNumber("100")).toBe("100");
    expect(validLimitNumber("10000000")).toBe("10000000"); // exactly the limit
  });

  it("rejects values above the limit (returns undefined)", () => {
    expect(validLimitNumber("10000001")).toBeUndefined();
  });

  it("respects a custom limit", () => {
    expect(validLimitNumber("50", 100)).toBe("50");
    expect(validLimitNumber("150", 100)).toBeUndefined();
  });

  it("rejects non-numeric input", () => {
    expect(validLimitNumber("abc")).toBeUndefined();
  });
});
