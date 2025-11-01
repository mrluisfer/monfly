import { useRouteContext } from "@tanstack/react-router";

export const useRouteUser = (): string => {
  const authedRouteContext = useRouteContext({
    from: "/_authed",
  });

  console.log("Auth route context:", authedRouteContext);

  if (!authedRouteContext) {
    console.error("Auth Route context not found");
    throw new Error("Auth Route context not found");
  }

  const userEmail =
    authedRouteContext.user || (authedRouteContext as any)?.email;
  console.log("Extracted user email:", userEmail);

  if (!userEmail || typeof userEmail !== "string") {
    console.error("Invalid user email from context:", userEmail);
    throw new Error("User email not found in route context");
  }

  return userEmail;
};
