import { describe, expect, it } from "vitest";

import { signupSchema } from "@/zod-schemas/signup-schema";

describe("signupSchema", () => {
  const valid = {
    acceptPrivacy: true,
    acceptTerms: true,
    email: "someone@monfly.app",
    name: "Someone",
    password: "supersecret",
  };

  it("accepts a signup with both acknowledgements checked", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a signup missing either acknowledgement", () => {
    for (const field of ["acceptTerms", "acceptPrivacy"] as const) {
      const result = signupSchema.safeParse({ ...valid, [field]: false });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.path).toEqual([field]);
    }
  });
});
