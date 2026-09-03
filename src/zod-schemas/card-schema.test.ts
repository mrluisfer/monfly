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
      CardFormSchema.safeParse({ last4: "", name: "Personal" }).success,
    ).toBe(true);
  });

  it("requires last4 to be exactly 4 digits when present", () => {
    expect(
      CardFormSchema.safeParse({ last4: "1234", name: "Personal" }).success,
    ).toBe(true);
    expect(
      CardFormSchema.safeParse({ last4: "12a4", name: "Personal" }).success,
    ).toBe(false);
    expect(
      CardFormSchema.safeParse({ last4: "123", name: "Personal" }).success,
    ).toBe(false);
  });

  it("rejects a non-numeric balance string", () => {
    expect(
      CardFormSchema.safeParse({ balance: "10.5", name: "Personal" }).success,
    ).toBe(true);
    expect(
      CardFormSchema.safeParse({ balance: "abc", name: "Personal" }).success,
    ).toBe(false);
  });
});
