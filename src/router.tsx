// src/router.ts (o donde lo tengas)
import { createRouter } from "@tanstack/react-router";

import { DefaultCatchBoundary } from "./components/shared/DefaultCatchBoundary";
import { NotFound } from "./components/shared/NotFound";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });

  return router;
}
