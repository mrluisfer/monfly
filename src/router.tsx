// src/router.ts (o donde lo tengas)
import { createRouter } from "@tanstack/react-router";

import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    //defaultNotFoundComponent: NotFound, // puedes pasar el componente directo
    scrollRestoration: true,
  });

  return router;
}
