import { Separator } from "~/components/ui/separator";

import { Card, CardContent } from "@/components/ui/card";

import { FooterNavigation } from "./Navigation";
import { StayConnect } from "./StayConnect";
import { TrialAlert } from "./TrialAlert";

export function Footer() {
  return (
    <Card className="mx-auto mt-8 mb-4 w-full max-w-6xl bg-transparent">
      <CardContent>
        <footer id="about" aria-labelledby="footer-title">
          <div>
            <div className="flex flex-col gap-8 md:gap-10">
              <h2 id="footer-title" className="sr-only">
                About Monfly and additional navigation
              </h2>
              <TrialAlert />
              <StayConnect />
              <Separator />
              <FooterNavigation />
            </div>
          </div>
        </footer>
      </CardContent>
    </Card>
  );
}
