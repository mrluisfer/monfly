import { Separator } from "~/components/ui/separator";
import { Globe } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { FooterNavigation } from "./Navigation";
import { StayConnect } from "./StayConnect";
import { TrialAlert } from "./TrialAlert";

export function Footer() {
  return (
    <Card className="max-w-6xl w-full my-8 mx-auto">
      <CardContent>
        <footer
          id="about"
          aria-labelledby="footer-title"
          className="px-4 pb-14 pt-6 sm:px-6 md:pt-8"
        >
          <div>
            <div className="flex flex-col gap-8 md:gap-10">
              <h2 id="footer-title" className="sr-only">
                About Monfly and additional navigation
              </h2>
              <TrialAlert />
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
      </CardContent>
    </Card>
  );
}
