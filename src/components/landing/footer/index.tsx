import { Separator } from "~/components/ui/separator";
import { Globe } from "lucide-react";

import { FooterNavigation } from "./navigation";
import { QuickActions } from "./quick-actions";
import { StayConnect } from "./stay-connect";
import { TrialAlert } from "./trial-alert";

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-white via-white to-background pt-8 pb-16 dark:from-zinc-900 dark:to-zinc-950 dark:via-zinc-950">
      <div className="px-4 sm:px-8 md:px-16 lg:px-28 xl:px-44 flex flex-col gap-10 md:gap-16 w-full">
        <TrialAlert />
        <StayConnect />
        <Separator />
        <QuickActions />
        <Separator />
        <FooterNavigation />
        <Separator />
        <div className="flex items-center justify-end">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Built by people around the world <Globe className="size-5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
