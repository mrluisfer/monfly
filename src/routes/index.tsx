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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-70 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to main content
      </a>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-30 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-aurora)_0%,transparent_72%)] opacity-55 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-90 h-72 w-72 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-20 blur-2xl dark:opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-130 h-80 w-80 rounded-full bg-[radial-gradient(circle,#fb923c_0%,transparent_72%)] opacity-16 blur-2xl"
      />
      <GlobalHeader />
      <main id="main-content" className="relative z-10 pb-10">
        <LandingHero />
        <UserStatsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
