import type { User } from "@prisma/client";
import { prismaClient } from "~/server/prisma";
import type { ApiResponse } from "~/types/ApiResponse";

export interface UpdateUserProfileInput {
  acceptPrivacy: boolean;
  acceptTerms: boolean;
  email: string;
  marketingOptIn?: boolean;
  name: string;
  preferredCurrency?: string | null;
  productUpdatesOptIn?: boolean;
}

export const updateUserProfile = async (
  data: UpdateUserProfileInput,
): Promise<ApiResponse<User | null>> => {
  try {
    const existing = await prismaClient.user.findUnique({
      select: { acceptedPrivacyAt: true, acceptedTermsAt: true, id: true },
      where: { email: data.email },
    });

    if (!existing) {
      return {
        data: null,
        error: true,
        message: "User not found",
        statusCode: 404,
        success: false,
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
      data: {
        name: data.name.trim(),
        preferredCurrency: data.preferredCurrency ?? null,
        ...(data.marketingOptIn === undefined
          ? {}
          : { marketingOptIn: data.marketingOptIn }),
        ...(data.productUpdatesOptIn === undefined
          ? {}
          : { productUpdatesOptIn: data.productUpdatesOptIn }),
        acceptedPrivacyAt,
        acceptedTermsAt,
      },
      where: { email: data.email },
    });

    return {
      data: user,
      error: false,
      message: "Profile updated successfully",
      statusCode: 200,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: true,
      message: `Error updating profile: ${message}`,
      statusCode: 500,
      success: false,
    };
  }
};
