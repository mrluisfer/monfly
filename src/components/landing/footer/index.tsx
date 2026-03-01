import { Separator } from "~/components/ui/separator";
import { Globe } from "lucide-react";

import { FooterNavigation } from "./navigation";
import { QuickActions } from "./quick-actions";
import { StayConnect } from "./stay-connect";
import { TrialAlert } from "./trial-alert";

export function Footer() {
  return (
    <footer
      id="about"
      aria-labelledby="footer-title"
      className="px-4 pb-16 pt-8 sm:px-6 md:pt-10"
    >
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-border/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(246,248,252,0.8))] p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.8)] backdrop-blur-md dark:bg-[linear-gradient(160deg,rgba(24,24,27,0.93),rgba(12,12,14,0.92))] sm:p-8 md:p-10">
        <div className="flex flex-col gap-9 md:gap-11">
          <h2 id="footer-title" className="sr-only">
            About Monfly and additional navigation
          </h2>
          <TrialAlert />
          <StayConnect />
          <Separator />
          <QuickActions />
          <Separator />
          <FooterNavigation />
          <Separator />
          <div className="flex items-center justify-end">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted-foreground">
              Built by people around the world <Globe className="size-4" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
