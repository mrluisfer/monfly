import { describe, expect, it } from "vitest";

import { TransactionFormSchema } from "@/zod-schemas/transaction-schema";

const base = {
  amount: "100",
  type: "expense" as const,
  category: "food",
};

describe("TransactionFormSchema amount", () => {
  it("accepts a positive amount under 1,000,000", () => {
    expect(TransactionFormSchema.safeParse(base).success).toBe(true);
  });

  it("rejects zero or negative amounts", () => {
    expect(
      TransactionFormSchema.safeParse({ ...base, amount: "0" }).success,
    ).toBe(false);
    expect(
      TransactionFormSchema.safeParse({ ...base, amount: "-5" }).success,
    ).toBe(false);
  });

  it("rejects amounts of 1,000,000 or more", () => {
    expect(
      TransactionFormSchema.safeParse({ ...base, amount: "1000000" }).success,
    ).toBe(false);
  });

  it("rejects an empty amount", () => {
    expect(
      TransactionFormSchema.safeParse({ ...base, amount: "" }).success,
    ).toBe(false);
  });
});

describe("TransactionFormSchema type", () => {
  it("only allows income or expense", () => {
    expect(
      TransactionFormSchema.safeParse({ ...base, type: "transfer" }).success,
    ).toBe(false);
  });
});

describe("TransactionFormSchema loan mode (superRefine)", () => {
  it("defaults loanMode to 'none'", () => {
    const parsed = TransactionFormSchema.parse(base);
    expect(parsed.loanMode).toBe("none");
  });

  it("requires a debtor when loanMode is 'create'", () => {
    const result = TransactionFormSchema.safeParse({
      ...base,
      loanMode: "create",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "loanDebtor")).toBe(
        true,
      );
    }
  });

  it("passes when loanMode is 'create' with a debtor", () => {
    expect(
      TransactionFormSchema.safeParse({
        ...base,
        loanMode: "create",
        loanDebtor: "Alice",
      }).success,
    ).toBe(true);
  });

  it("requires appliedToLoanId when loanMode is 'apply'", () => {
    const result = TransactionFormSchema.safeParse({
      ...base,
      loanMode: "apply",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "appliedToLoanId"),
      ).toBe(true);
    }
  });

  it("passes when loanMode is 'apply' with a loan id", () => {
    expect(
      TransactionFormSchema.safeParse({
        ...base,
        loanMode: "apply",
        appliedToLoanId: "11111111-1111-4111-8111-111111111111",
      }).success,
    ).toBe(true);
  });
});
