import { describe, expect, it } from "vitest";

import {
  CreateLoanInputSchema,
  LoanFormSchema,
} from "@/zod-schemas/loan-schema";

describe("LoanFormSchema", () => {
  const base = { debtor: "Bob", amount: "250", direction: "lent" as const };

  it("accepts a valid loan form", () => {
    expect(LoanFormSchema.safeParse(base).success).toBe(true);
  });

  it("trims and requires a debtor name", () => {
    expect(LoanFormSchema.safeParse({ ...base, debtor: "   " }).success).toBe(
      false,
    );
  });

  it("requires a positive numeric amount", () => {
    expect(LoanFormSchema.safeParse({ ...base, amount: "0" }).success).toBe(
      false,
    );
    expect(LoanFormSchema.safeParse({ ...base, amount: "abc" }).success).toBe(
      false,
    );
  });

  it("only allows known directions", () => {
    expect(
      LoanFormSchema.safeParse({ ...base, direction: "gifted" }).success,
    ).toBe(false);
  });
});

describe("CreateLoanInputSchema (server shape)", () => {
  it("requires amount to be a positive number, not a string", () => {
    expect(
      CreateLoanInputSchema.safeParse({ debtor: "Bob", amount: 250 }).success,
    ).toBe(true);
    expect(
      CreateLoanInputSchema.safeParse({ debtor: "Bob", amount: "250" }).success,
    ).toBe(false);
  });

  it("rejects an invalid transactionId uuid", () => {
    expect(
      CreateLoanInputSchema.safeParse({
        debtor: "Bob",
        amount: 250,
        transactionId: "not-a-uuid",
      }).success,
    ).toBe(false);
  });
});
