import { Link } from "@tanstack/react-router";
import { ChevronRight, GlobeIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Footer } from "~/components/landing/footer";
import { GlobalHeader } from "~/components/landing/global-header";

interface LegalLayoutProps {
  breadcrumb: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  lastUpdated: string;
  title: string;
}

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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-70 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
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
              className="flex items-center gap-1 text-muted-foreground text-xs"
            >
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground">{breadcrumb}</span>
            </nav>

            <div className="landing-fade-up space-y-5">
              <Badge variant="default">{eyebrow}</Badge>
              <h1 className="text-balance font-[family-name:var(--font-syne)] font-bold text-[2rem] text-foreground leading-[1.05] tracking-tight sm:text-[2.6rem] md:text-[3rem]">
                <span className="landing-gradient-text">{title}</span>
              </h1>
              <p className="max-w-2xl text-pretty text-muted-foreground text-sm sm:text-base">
                {description}
              </p>
              <p className="text-[0.72rem] text-muted-foreground uppercase tracking-[0.13em]">
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
              className="uppercase tracking-[0.13em]"
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

interface LegalSectionProps {
  children: ReactNode;
  id: string;
  index: number;
  title: string;
}

export function LegalSection({
  id,
  index,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-6">
      <div className="flex items-baseline gap-3">
        <span className="font-[family-name:var(--font-sora)] font-semibold text-muted-foreground text-xs uppercase tracking-[0.18em]">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-[family-name:var(--font-syne)] font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="prose-legal mt-3 space-y-3 text-muted-foreground text-sm leading-relaxed sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}
