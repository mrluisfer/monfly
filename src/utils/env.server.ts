type BooleanString = "true" | "false";

function getEnv(name: string) {
  return process.env[name]?.trim();
}

function isBooleanString(value: string): value is BooleanString {
  return value === "true" || value === "false";
}

function parseBooleanEnv(name: string): boolean | undefined {
  const value = getEnv(name);
  if (!value) {
    return undefined;
  }

  if (!isBooleanString(value)) {
    throw new Error(`Invalid boolean value for ${name}. Use "true" or "false".`);
  }

  return value === "true";
}

function getRequiredSecret(name: string) {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const isProduction = process.env.NODE_ENV === "production";

const sessionPassword = getRequiredSecret("SESSION_PASSWORD");

if (isProduction) {
  if (sessionPassword.length < 32) {
    throw new Error(
      "SESSION_PASSWORD must be at least 32 characters in production."
    );
  }

  if (sessionPassword === "default_password") {
    throw new Error(
      "SESSION_PASSWORD cannot use insecure defaults in production."
    );
  }
}

export const serverEnv = {
  isProduction,
  sessionPassword,
  sessionCookieSecure: parseBooleanEnv("SESSION_COOKIE_SECURE"),
};
