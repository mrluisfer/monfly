/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/shared/DefaultCatchBoundary";
import { NotFound } from "~/components/shared/NotFound";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useGlobalHapticFeedback } from "~/hooks/haptics/useGlobalHapticFeedback";
import { useDarkMode } from "~/hooks/ui/useDarkMode";
import { useSonnerPosition } from "~/hooks/ui/useSonnerPosition";
import { SileoToaster } from "~/lib/toaster";
import { UiStateEffects } from "~/state/effects";
import appCss from "~/styles/globals.css?url";
import { seo } from "~/utils/seo.js";
// import appCss from "~/styles/output.css?url";

import { Provider as JotaiProvider } from "jotai";

// Dev-only and lazily imported so the devtools never ship in the production
// bundle.
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    title: "Monfly | Track your Expenses & Income | TanStack + shadcn",
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
      },
      // theme-color adapts to system light/dark mode
      {
        name: "theme-color",
        content: "#ffffff",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#000000",
        media: "(prefers-color-scheme: dark)",
      },
      { name: "color-scheme", content: "light dark" },
      { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "Monfly" },
      { name: "msapplication-TileColor", content: "#000000" },
      {
        name: "description",
        content:
          "The ultimate personal finance dashboard. Track your expenses, income, cards, and financial reports, all in one place. Built with TanStack Start, shadcn/ui, and React.",
      },
      {
        name: "keywords",
        content:
          "finance, dashboard, expenses, income, cards, reports, React, TanStack, shadcn, money, budgeting, personal, app",
      },
      { name: "author", content: "Luis Alvarez (mrLuisFer)" },
      {
        name: "robots",
        content:
          "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      // Open Graph (Facebook, LinkedIn, etc.)
      {
        property: "og:title",
        content: "Monfly | TanStack + shadcn",
      },
      {
        property: "og:description",
        content:
          "Track your money, expenses and income visually with beautiful charts and financial reports. Try it now!",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://monfly.vercel.app/" },
      { property: "og:image", content: "/og-image.png" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Monfly | TanStack + shadcn",
      },
      {
        name: "twitter:description",
        content:
          "Track your money, expenses and income visually with beautiful charts and financial reports. Try it now!",
      },
      { name: "twitter:image", content: "/og-image.png" },
      // Canonical
      { rel: "canonical", href: "https://monfly.vercel.app/" },
      ...seo({
        title: "Monfly | Type-Safe, Client-First, Full-Stack React Framework",
        description:
          "TanStack Start is a type-safe, client-first, full-stack React framework. ",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Preconnect to font origins to reduce latency
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/codium.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/codium.svg",
      },
      { rel: "icon", href: "/codium.svg" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" }, // optional
      { rel: "manifest", href: "/site.webmanifest", color: "#000000" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  // Per-request QueryClient created in getRouter() (src/router.tsx) and
  // passed through router context, so SSR never shares cache across users.
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <UiStateEffects />
        <AppDocument>
          <Outlet />
        </AppDocument>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

type ToasterProps = React.ComponentProps<typeof SileoToaster>;

// Shared document shell. Safe to render outside providers (error boundaries)
// with the default toaster settings.
function RootDocument({
  children,
  toasterPosition = "bottom-right",
  toasterTheme = "system",
}: {
  children: React.ReactNode;
  toasterPosition?: ToasterProps["position"];
  toasterTheme?: ToasterProps["theme"];
}) {
  return (
    <html lang="en" data-built-by="bHVpcy1hbHZhcmV6L0Btckx1aXNGZXI=">
      <head title="Monfly | Track your Expenses & Income | TanStack + shadcn">
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <SileoToaster position={toasterPosition} theme={toasterTheme} />
          {children}
          {import.meta.env.DEV && (
            <React.Suspense fallback={null}>
              <TanStackRouterDevtools position="bottom-right" />
            </React.Suspense>
          )}
          <Scripts />
        </TooltipProvider>
      </body>
    </html>
  );
}

// Variant used in the normal app flow: reads user preferences (requires
// providers above it in the tree).
function AppDocument({ children }: { children: React.ReactNode }) {
  useGlobalHapticFeedback();
  const { position } = useSonnerPosition();
  const { theme } = useDarkMode();

  return (
    <RootDocument toasterPosition={position} toasterTheme={theme}>
      {children}
    </RootDocument>
  );
}
