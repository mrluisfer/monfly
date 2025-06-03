import type { User } from "@prisma/client";
// src/services/session.server.ts
import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
  email: User["email"];
};

export function useAppSession() {
  return useSession<SessionUser>({
    password: process.env.SESSION_PASSWORD || "default_password",
  });
}
