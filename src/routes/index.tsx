import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "~/components/landing/footer";
import { GlobalHeader } from "~/components/landing/global-header";
import { LandingHero } from "~/components/landing/hero/hero";
import { PricingSection } from "~/components/landing/pricing-section";
import { UserStatsSection } from "~/components/landing/user-stats";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Monfly | Modern Personal Finance Dashboard",
    meta: [
      {
        name: "description",
        content:
          "Track expenses, forecast cashflow, and optimize your financial decisions with Monfly's modern personal finance dashboard.",
      },
      {
        name: "keywords",
        content:
          "personal finance app, budget tracking, cashflow dashboard, expense manager, money management",
      },
      {
        property: "og:title",
        content: "Monfly | Modern Money Operating System",
      },
      {
        property: "og:description",
        content:
          "From reactive tracking to proactive financial decisions with real-time insights and clean dashboards.",
      },
    ],
  }),
  component: Home,
});

export default function Home() {
  return (
    <div className="landing-shell relative min-h-screen overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-70 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to main content
      </a>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-aurora)_0%,transparent_70%)] opacity-70 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-104 h-72 w-72 rounded-full bg-[radial-gradient(circle,#22d3ee_0%,transparent_72%)] opacity-25 blur-2xl dark:opacity-15"
      />
      <GlobalHeader />
      <main id="main-content" className="relative z-10">
        <LandingHero />
        <UserStatsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
