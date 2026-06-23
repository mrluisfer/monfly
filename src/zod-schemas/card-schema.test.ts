import { describe, expect, it } from "vitest";

import { CardFormSchema } from "@/zod-schemas/card-schema";

describe("CardFormSchema", () => {
  it("accepts a minimal valid card (name only)", () => {
    expect(CardFormSchema.safeParse({ name: "Personal" }).success).toBe(true);
  });

  it("requires a non-empty name", () => {
    expect(CardFormSchema.safeParse({ name: "  " }).success).toBe(false);
  });

  it("accepts an empty/absent last4 (optional)", () => {
    expect(
      CardFormSchema.safeParse({ name: "Personal", last4: "" }).success,
    ).toBe(true);
  });

  it("requires last4 to be exactly 4 digits when present", () => {
    expect(
      CardFormSchema.safeParse({ name: "Personal", last4: "1234" }).success,
    ).toBe(true);
    expect(
      CardFormSchema.safeParse({ name: "Personal", last4: "12a4" }).success,
    ).toBe(false);
    expect(
      CardFormSchema.safeParse({ name: "Personal", last4: "123" }).success,
    ).toBe(false);
  });

  it("rejects a non-numeric balance string", () => {
    expect(
      CardFormSchema.safeParse({ name: "Personal", balance: "10.5" }).success,
    ).toBe(true);
    expect(
      CardFormSchema.safeParse({ name: "Personal", balance: "abc" }).success,
    ).toBe(false);
  });
});
