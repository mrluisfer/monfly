import { useRouteContext } from "@tanstack/react-router";

export const useRouteUser = (): string => {
  const authedRouteContext: { user: string } = useRouteContext({
    from: "/_authed",
  });

  if (!authedRouteContext) {
    throw new Error("Auth Route context not found");
  }

  return authedRouteContext.user;
};
