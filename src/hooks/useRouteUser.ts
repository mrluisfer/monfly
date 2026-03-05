import { useRouteContext } from "@tanstack/react-router";

export const useRouteUser = (): string => {
  const authedRouteContext = useRouteContext({
    from: "/_authed",
  });

  if (!authedRouteContext) {
    console.warn("❌ Auth Route context not found - may still be loading");
    return ""; // Return empty string instead of throwing
  }

  const userEmail =
    authedRouteContext.user || (authedRouteContext as any)?.email;

  if (!userEmail || typeof userEmail !== "string") {
    console.warn("⚠️ Invalid user email from context:", userEmail);
    return ""; // Return empty string instead of throwing
  }

  return userEmail;
};
