import { Separator } from "~/components/ui/separator";
import { Globe } from "lucide-react";

import { FooterNavigation } from "./Navigation";
import { QuickActions } from "./QuickActions";
import { StayConnect } from "./StayConnect";
import { TrialAlert } from "./TrialAlert";

export function Footer() {
  return (
    <footer
      id="about"
      aria-labelledby="footer-title"
      className="px-4 pb-14 pt-6 sm:px-6 md:pt-8"
    >
      <div className="landing-glass-panel mx-auto w-full max-w-6xl rounded-[2rem] border border-border/70 p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.8)] sm:p-8 md:p-10">
        <div className="flex flex-col gap-8 md:gap-10">
          <h2 id="footer-title" className="sr-only">
            About Monfly and additional navigation
          </h2>
          <TrialAlert />
          <QuickActions />
          <Separator />
          <StayConnect />
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
