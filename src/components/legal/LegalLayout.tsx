import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Footer } from "~/components/landing/footer";
import { GlobalHeader } from "~/components/landing/global-header";
import { ChevronRight, GlobeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  breadcrumb: string;
  children: ReactNode;
};

export function LegalLayout({
  eyebrow,
  title,
  description,
  lastUpdated,
  breadcrumb,
  children,
}: LegalLayoutProps) {
  return (
    <div className="landing-shell relative min-h-screen overflow-x-clip pb-8">
      <a
        href="#legal-content"
        className="focus:bg-foreground focus:text-background sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-70 focus:rounded-full focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-30 left-1/2 size-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-aurora)_0%,transparent_72%)] opacity-55 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-90 -right-20 size-72 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-20 blur-2xl dark:opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-130 -left-28 size-80 rounded-full bg-[radial-gradient(circle,#fb923c_0%,transparent_72%)] opacity-16 blur-2xl"
      />

      <GlobalHeader />

      <main id="legal-content" className="relative z-10 pb-10">
        <section className="relative px-4 pt-11 pb-8 sm:px-6 md:pt-16">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 xl:max-w-6xl">
            <nav
              aria-label="Breadcrumb"
              className="text-muted-foreground flex items-center gap-1 text-xs"
            >
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground">{breadcrumb}</span>
            </nav>

            <div className="landing-fade-up space-y-5">
              <Badge variant="default">{eyebrow}</Badge>
              <h1 className="text-foreground font-[family-name:var(--font-syne)] text-[2rem] leading-[1.05] font-bold tracking-tight text-balance sm:text-[2.6rem] md:text-[3rem]">
                <span className="landing-gradient-text">{title}</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-sm text-pretty sm:text-base">
                {description}
              </p>
              <p className="text-muted-foreground text-[0.72rem] tracking-[0.13em] uppercase">
                Last updated · {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6">
          <div className="mx-auto max-w-4xl xl:max-w-6xl">{children}</div>
        </section>
      </main>

      <Footer />

      <div className="flex items-center justify-center">
        <Button
          variant="link"
          size="xs"
          render={
            <a
              href="https://github.com/mrluisfer/monfly"
              target="_blank"
              rel="noopener"
              className="tracking-[0.13em] uppercase"
            />
          }
        >
          <GlobeIcon className="size-4" />
          Built by people around the world
        </Button>
      </div>
    </div>
  );
}

type LegalSectionProps = {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
};

export function LegalSection({
  id,
  index,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-6">
      <div className="flex items-baseline gap-3">
        <span className="text-muted-foreground font-[family-name:var(--font-sora)] text-xs font-semibold tracking-[0.18em] uppercase">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="text-foreground font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="prose-legal text-muted-foreground mt-3 space-y-3 text-sm leading-relaxed sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}
