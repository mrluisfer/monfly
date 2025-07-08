import type * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary.js";
import { NotFound } from "~/components/not-found.js";
import { Toaster } from "~/components/ui/sonner";
import { DarkModeProvider } from "~/context/dark-mode-provider";
import { SonnerPositionProvider } from "~/context/sonner-position-provider";
import { ActiveThemeProvider } from "~/context/theme-provider";
import { useSonnerPosition } from "~/hooks/use-sonner-position";
import appCss from "~/styles/app.css?url";
// import appCss from "~/styles/output.css?url";
import { seo } from "~/utils/seo.js";

export const Route = createRootRoute({
  head: () => ({
    title: "Monfly | Track your Expenses & Income | TanStack + shadcn",
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#18181b" },
      { name: "color-scheme", content: "light dark" },
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
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/codium.svg",
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
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
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

const queryClient = new QueryClient();
function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider key="theme-provider">
        <ActiveThemeProvider key="theme-provider" initialTheme="default">
          <SonnerPositionProvider initialPosition="bottom-right">
            <RootDocument>
              <Outlet />
            </RootDocument>
          </SonnerPositionProvider>
        </ActiveThemeProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { position } = useSonnerPosition();

  return (
    <html lang="en">
      <head title="Monfly | Track your Expenses & Income | TanStack + shadcn">
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
        <Toaster position={position} closeButton richColors key="sonner" />
      </body>
    </html>
  );
}
