/// <reference types="vite/client" />
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
import { TooltipProvider } from "~/components/ui/tooltip";
import { DarkModeProvider } from "~/context/dark-mode-provider";
import { FontDisplayProvider } from "~/context/font-display-provider";
import { SonnerPositionProvider } from "~/context/sonner-position-provider";
import { ActiveThemeProvider } from "~/context/theme-provider";
import { useDarkMode } from "~/hooks/use-dark-mode";
import { useFontDisplay } from "~/hooks/use-font-display";
import { useSonnerPosition } from "~/hooks/use-sonner-position";
import { SileoToaster } from "~/lib/toaster";
import appCss from "~/styles/globals.css?url";
import { seo } from "~/utils/seo.js";
// import appCss from "~/styles/output.css?url";
import clsx from "clsx";

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

const queryClient = new QueryClient({
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

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider key="theme-provider">
        <FontDisplayProvider key="font-display-provider">
          <ActiveThemeProvider key="theme-provider" initialTheme="default">
            <SonnerPositionProvider initialPosition="bottom-right">
              <RootDocumentWithProviders>
                <Outlet />
              </RootDocumentWithProviders>
            </SonnerPositionProvider>
          </ActiveThemeProvider>
        </FontDisplayProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

// Component that can be used outside providers (for error boundaries)
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head title="Monfly | Track your Expenses & Income | TanStack + shadcn">
        <HeadContent />
      </head>
      <body>
        <TooltipProvider delayDuration={200}>
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
          <SileoToaster position="bottom-right" theme="system" />
        </TooltipProvider>
      </body>
    </html>
  );
}

// Component that uses providers (for normal app flow)
function RootDocumentWithProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { position } = useSonnerPosition();
  const { fontDisplay } = useFontDisplay();
  const { theme } = useDarkMode();

  return (
    <html lang="en">
      <head title="Monfly | Track your Expenses & Income | TanStack + shadcn">
        <HeadContent />
      </head>
      <body className={clsx(fontDisplay)}>
        <TooltipProvider delayDuration={200}>
          <SileoToaster position={position} theme={theme} />
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </TooltipProvider>
      </body>
    </html>
  );
}
