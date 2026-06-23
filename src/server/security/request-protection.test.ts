import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the framework boundary so these unit tests don't need a real request
// context. setResponseHeader is only hit on the rate-limit/RateLimitError path.
const setResponseHeader = vi.fn();
vi.mock("@tanstack/react-start/server", () => ({
  getRequest: vi.fn(),
  getRequestIP: vi.fn(),
  setResponseHeader: (...args: unknown[]) => setResponseHeader(...args),
}));

// Mock the session helper so we control what "logged in" means per test.
const useAppSession = vi.fn();
vi.mock("~/server/auth/session", () => ({
  useAppSession: () => useAppSession(),
}));

import {
  enforceRateLimit,
  RateLimitError,
  resolveSessionEmail,
  SecurityError,
  toSecurityErrorResponse,
} from "@/server/security/request-protection";

const RATE_LIMIT_BUCKETS = Symbol.for("monfly.rate-limit-buckets");

beforeEach(() => {
  vi.clearAllMocks();
  // Rate-limit buckets live on globalThis — wipe them so tests don't bleed.
  delete (globalThis as Record<symbol, unknown>)[RATE_LIMIT_BUCKETS];
});

describe("resolveSessionEmail", () => {
  it("returns the session email on a valid session (happy path)", async () => {
    useAppSession.mockResolvedValue({ data: { email: "user@example.com" } });
    await expect(resolveSessionEmail()).resolves.toBe("user@example.com");
  });

  it("trims the session email", async () => {
    useAppSession.mockResolvedValue({ data: { email: "  user@example.com  " } });
    await expect(resolveSessionEmail()).resolves.toBe("user@example.com");
  });

  it("throws 401 when there is no session email", async () => {
    useAppSession.mockResolvedValue({ data: {} });
    await expect(resolveSessionEmail()).rejects.toMatchObject({
      name: "SecurityError",
      statusCode: 401,
    });
  });

  it("throws 403 when the requested email isn't the session owner", async () => {
    useAppSession.mockResolvedValue({ data: { email: "owner@example.com" } });
    await expect(
      resolveSessionEmail("someone-else@example.com"),
    ).rejects.toMatchObject({ name: "SecurityError", statusCode: 403 });
  });

  it("passes when the expected email matches the session", async () => {
    useAppSession.mockResolvedValue({ data: { email: "owner@example.com" } });
    await expect(resolveSessionEmail("owner@example.com")).resolves.toBe(
      "owner@example.com",
    );
  });
});

describe("enforceRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const config = {
    scope: "test:scope",
    limit: 2,
    windowMs: 1000,
    identifier: "user-1",
  };

  it("allows requests up to the limit", () => {
    expect(() => enforceRateLimit(config)).not.toThrow();
    expect(() => enforceRateLimit(config)).not.toThrow();
  });

  it("throws RateLimitError once the limit is exceeded", () => {
    enforceRateLimit(config);
    enforceRateLimit(config);
    try {
      enforceRateLimit(config);
      throw new Error("expected RateLimitError to be thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(RateLimitError);
      expect((error as RateLimitError).statusCode).toBe(429);
      expect((error as RateLimitError).retryAfterMs).toBeGreaterThan(0);
    }
    // It also signals the client how long to wait.
    expect(setResponseHeader).toHaveBeenCalledWith("Retry-After", "1");
  });

  it("resets the bucket after the window elapses", () => {
    enforceRateLimit(config);
    enforceRateLimit(config);
    vi.advanceTimersByTime(1001); // window passed
    expect(() => enforceRateLimit(config)).not.toThrow();
  });

  it("isolates buckets by identifier", () => {
    enforceRateLimit(config);
    enforceRateLimit(config);
    // A different actor has its own fresh budget.
    expect(() =>
      enforceRateLimit({ ...config, identifier: "user-2" }),
    ).not.toThrow();
  });
});

describe("toSecurityErrorResponse", () => {
  it("maps a SecurityError to a standard failed ApiResponse", () => {
    const response = toSecurityErrorResponse(new SecurityError("Forbidden", 403));
    expect(response).toEqual({
      error: true,
      success: false,
      message: "Forbidden",
      data: null,
      statusCode: 403,
    });
  });

  it("sets Retry-After for a RateLimitError", () => {
    const response = toSecurityErrorResponse(new RateLimitError(2500));
    expect(response?.statusCode).toBe(429);
    expect(setResponseHeader).toHaveBeenCalledWith("Retry-After", "3"); // ceil(2500/1000)
  });

  it("returns null for non-security errors (so callers fall through to 500)", () => {
    expect(toSecurityErrorResponse(new Error("db exploded"))).toBeNull();
  });
});
