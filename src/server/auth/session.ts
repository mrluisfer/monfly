import type { User } from "@prisma/client";
// src/services/session.server.ts
import { useSession } from "@tanstack/react-start/server";
import { serverEnv } from "~/utils/env.server";

interface SessionUser {
  email: User["email"];
}

function resolveSessionCookieSecure() {
  const secureOverride = serverEnv.sessionCookieSecure;
  if (typeof secureOverride === "boolean") {
    return secureOverride;
  }

  // In local development (including host/IP testing over HTTP), secure cookies
  // are not sent by the browser. Keep them secure by default in production.
  return serverEnv.isProduction;
}

export function useAppSession() {
  return useSession<SessionUser>({
    cookie: {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: resolveSessionCookieSecure(),
    },
    password: serverEnv.sessionPassword,
  });
}
