import {
  getRequest,
  getRequestIP,
  setResponseHeader,
} from "@tanstack/react-start/server";
import type { ApiResponse } from "~/types/ApiResponse";
import { useAppSession } from "~/utils/auth/session";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitConfig = {
  scope: string;
  limit: number;
  windowMs: number;
  identifier?: string;
};

const RATE_LIMIT_BUCKETS_SYMBOL = Symbol.for("monfly.rate-limit-buckets");
const RATE_LIMIT_MAX_BUCKETS = 10_000;

type GlobalWithRateLimitBuckets = typeof globalThis & {
  [RATE_LIMIT_BUCKETS_SYMBOL]?: Map<string, RateLimitBucket>;
};

function getRateLimitBuckets() {
  const globalScope = globalThis as GlobalWithRateLimitBuckets;
  if (!globalScope[RATE_LIMIT_BUCKETS_SYMBOL]) {
    globalScope[RATE_LIMIT_BUCKETS_SYMBOL] = new Map<string, RateLimitBucket>();
  }

  return globalScope[RATE_LIMIT_BUCKETS_SYMBOL];
}

function cleanupExpiredBuckets(buckets: Map<string, RateLimitBucket>, now: number) {
  if (buckets.size < RATE_LIMIT_MAX_BUCKETS) {
    return;
  }

  for (const [key, value] of buckets.entries()) {
    if (value.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function getRequestFingerprint() {
  const request = getRequest();
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = xForwardedFor?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip =
    getRequestIP({ xForwardedFor: true }) ??
    forwardedIp ??
    realIp ??
    "unknown-ip";
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";

  return `${ip}:${userAgent}`;
}

export class SecurityError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "SecurityError";
    this.statusCode = statusCode;
  }
}

export class RateLimitError extends SecurityError {
  retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super("Too many requests. Please try again shortly.", 429);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

export function enforceRateLimit({
  scope,
  limit,
  windowMs,
  identifier,
}: RateLimitConfig) {
  const now = Date.now();
  const buckets = getRateLimitBuckets();
  cleanupExpiredBuckets(buckets, now);

  const actor = identifier ?? getRequestFingerprint();
  const key = `${scope}:${actor}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (bucket.count >= limit) {
    const retryAfterMs = bucket.resetAt - now;
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    setResponseHeader("Retry-After", String(retryAfterSeconds));
    throw new RateLimitError(retryAfterMs);
  }

  bucket.count += 1;
  buckets.set(key, bucket);
}

export async function resolveSessionEmail(expectedEmail?: string) {
  const session = await useAppSession();
  const sessionEmail = session.data.email?.trim();

  if (!sessionEmail) {
    throw new SecurityError("Not authenticated", 401);
  }

  if (expectedEmail && expectedEmail !== sessionEmail) {
    throw new SecurityError("Forbidden", 403);
  }

  return sessionEmail;
}

export function toSecurityErrorResponse(
  error: unknown,
  fallbackMessage = "Security policy blocked the request"
): ApiResponse<null> | null {
  if (!(error instanceof SecurityError)) {
    return null;
  }

  if (error instanceof RateLimitError) {
    const retryAfterSeconds = Math.max(1, Math.ceil(error.retryAfterMs / 1000));
    setResponseHeader("Retry-After", String(retryAfterSeconds));
  }

  return {
    error: true,
    success: false,
    message: error.message || fallbackMessage,
    data: null,
    statusCode: error.statusCode,
  } as ApiResponse<null>;
}
