import type { User } from "@prisma/client";
// src/services/session.server.ts
import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
  email: User["email"];
};

function resolveSessionCookieSecure() {
  const secureOverride = process.env.SESSION_COOKIE_SECURE;

  if (secureOverride === "true") {
    return true;
  }

  if (secureOverride === "false") {
    return false;
  }

  // In local development (including host/IP testing over HTTP), secure cookies
  // are not sent by the browser. Keep them secure by default in production.
  return process.env.NODE_ENV === "production";
}

export function useAppSession() {
  return useSession<SessionUser>({
    password: process.env.SESSION_PASSWORD || "default_password",
    cookie: {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: resolveSessionCookieSecure(),
    },
  });
}
