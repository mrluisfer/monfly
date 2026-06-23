import { describe, expect, it } from "vitest";

import { changePasswordSchema } from "@/zod-schemas/user-schema";

describe("changePasswordSchema", () => {
  const valid = {
    currentPassword: "oldpass1",
    newPassword: "NewPass1",
    confirmNewPassword: "NewPass1",
  };

  it("accepts a strong, confirmed, different new password", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("enforces complexity (lower, upper, number, min 8)", () => {
    const weak = ["short1A", "alllowercase1", "ALLUPPERCASE1", "NoNumberHere"];
    for (const newPassword of weak) {
      const result = changePasswordSchema.safeParse({
        ...valid,
        newPassword,
        confirmNewPassword: newPassword,
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects when confirmation doesn't match", () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      confirmNewPassword: "Different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "confirmNewPassword"),
      ).toBe(true);
    }
  });

  it("rejects when the new password equals the current one", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "SamePass1",
      newPassword: "SamePass1",
      confirmNewPassword: "SamePass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "newPassword")).toBe(
        true,
      );
    }
  });
});
