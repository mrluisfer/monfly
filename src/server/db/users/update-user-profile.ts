import type { User } from "@prisma/client";
import type { ApiResponse } from "~/types/ApiResponse";

import { prismaClient } from "~/server/prisma";

export type UpdateUserProfileInput = {
  email: string;
  name: string;
  preferredCurrency?: string | null;
  marketingOptIn?: boolean;
  productUpdatesOptIn?: boolean;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
};

export const updateUserProfile = async (
  data: UpdateUserProfileInput,
): Promise<ApiResponse<User | null>> => {
  try {
    const existing = await prismaClient.user.findUnique({
      where: { email: data.email },
      select: { id: true, acceptedTermsAt: true, acceptedPrivacyAt: true },
    });

    if (!existing) {
      return {
        error: true,
        message: "User not found",
        data: null,
        success: false,
        statusCode: 404,
      };
    }

    // The form sends booleans; we persist the moment of acceptance. Keep the
    // original timestamp if it was already accepted, stamp now on first accept,
    // and clear it if the user unchecks.
    const acceptedTermsAt = data.acceptTerms
      ? (existing.acceptedTermsAt ?? new Date())
      : null;
    const acceptedPrivacyAt = data.acceptPrivacy
      ? (existing.acceptedPrivacyAt ?? new Date())
      : null;

    const user = await prismaClient.user.update({
      where: { email: data.email },
      data: {
        name: data.name.trim(),
        preferredCurrency: data.preferredCurrency ?? null,
        ...(data.marketingOptIn === undefined
          ? {}
          : { marketingOptIn: data.marketingOptIn }),
        ...(data.productUpdatesOptIn === undefined
          ? {}
          : { productUpdatesOptIn: data.productUpdatesOptIn }),
        acceptedTermsAt,
        acceptedPrivacyAt,
      },
    });

    return {
      error: false,
      message: "Profile updated successfully",
      data: user,
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: true,
      message: `Error updating profile: ${message}`,
      data: null,
      success: false,
      statusCode: 500,
    };
  }
};
