import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "~/components/landing/footer";
import { GlobalHeader } from "~/components/landing/global-header";
import { LandingHero } from "~/components/landing/hero/hero";
import { PricingSection } from "~/components/landing/pricing-section";
import { UserStatsSection } from "~/components/landing/user-stats";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  return (
    <div className="h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <GlobalHeader />
      <LandingHero />
      <UserStatsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
