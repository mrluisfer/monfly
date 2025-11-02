import { useRouteContext } from "@tanstack/react-router";

export const useRouteUser = (): string => {
  const authedRouteContext = useRouteContext({
    from: "/_authed",
  });

  console.log("🔍 useRouteUser - authedRouteContext:", authedRouteContext);

  if (!authedRouteContext) {
    console.warn("❌ Auth Route context not found - may still be loading");
    return ""; // Return empty string instead of throwing
  }

  const userEmail =
    authedRouteContext.user || (authedRouteContext as any)?.email;

  console.log("📧 useRouteUser - extracted userEmail:", userEmail);

  if (!userEmail || typeof userEmail !== "string") {
    console.warn("⚠️ Invalid user email from context:", userEmail);
    return ""; // Return empty string instead of throwing
  }

  console.log("✅ useRouteUser - returning valid email:", userEmail);
  return userEmail;
};
