import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { DefaultCatchBoundary } from "./components/shared/DefaultCatchBoundary";
import { NotFound } from "./components/shared/NotFound";
import { routeTree } from "./routeTree.gen";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        networkMode: "online", // Only run queries when online
        retry: (failureCount, error) => {
          // Reduce retry attempts to prevent stream issues
          if (failureCount >= 1) return false;

          // Don't retry on 4xx errors
          if (
            error &&
            "status" in error &&
            typeof error.status === "number" &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false;
          }
          return failureCount < 1;
        },
        retryDelay: () => 1000, // Fixed 1 second delay
      },
      mutations: {
        retry: 0, // No retries for mutations to prevent conflicts
        networkMode: "online",
      },
    },
  });
}

export function getRouter() {
  // One QueryClient per router instance. getRouter() runs once per request on
  // the server, so the query cache is never shared across users/requests
  // during SSR (a module-scope client would be).
  const queryClient = createQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });

  return router;
}
