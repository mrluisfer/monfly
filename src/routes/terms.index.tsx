import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileText, Gavel, ShieldAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/terms/")({
  head: () => ({
    title: "Terms & Conditions | Monfly",
    meta: [
      {
        name: "description",
        content:
          "The terms that govern your use of Monfly's personal finance dashboard, including acceptable use, account responsibilities, and liability.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsRoute,
});

const pillars = [
  {
    icon: FileText,
    title: "Clear, simple terms",
    description: "Plain language so you know exactly what you agree to.",
    tone: "text-teal-600 dark:text-teal-300",
  },
  {
    icon: ShieldAlert,
    title: "Fair acceptable use",
    description: "Reasonable limits to protect every workspace on Monfly.",
    tone: "text-amber-600 dark:text-amber-300",
  },
  {
    icon: Gavel,
    title: "Predictable changes",
    description: "We notify you before material changes take effect.",
    tone: "text-emerald-600 dark:text-emerald-300",
  },
];

function TermsRoute() {
  return (
    <LegalLayout
      eyebrow="Legal"
      breadcrumb="Terms & Conditions"
      title="Terms & Conditions"
      description="These Terms govern your access to and use of Monfly. Please read them carefully — by creating an account you accept the terms below."
      lastUpdated="May 9, 2026"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {pillars.map((pillar, index) => (
          <Card
            key={pillar.title}
            size="sm"
            className="landing-fade-up"
            style={
              {
                animationDelay: `${index * 0.07 + 0.05}s`,
              } as React.CSSProperties
            }
          >
            <CardContent>
              <pillar.icon className={`size-5 ${pillar.tone}`} />
              <p className="text-foreground mt-2 text-sm font-semibold">
                {pillar.title}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {pillar.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent>
          <LegalSection id="agreement" index={1} title="Agreement">
            <p>
              These Terms & Conditions ("Terms") form a binding agreement
              between you and Monfly ("we", "our", "us"). By signing up,
              accessing, or using Monfly you confirm that you can lawfully enter
              into this agreement and that you accept these Terms in full.
            </p>
          </LegalSection>

          <LegalSection id="service" index={2} title="The Service">
            <p>
              Monfly is a personal finance dashboard that lets you record
              transactions, organize categories, plan budgets, and visualize
              reports. Monfly does not provide financial, tax, investment, or
              legal advice. Any decision you make based on the information shown
              in the dashboard remains your own responsibility.
            </p>
          </LegalSection>

          <LegalSection id="accounts" index={3} title="Accounts & Eligibility">
            <p>
              You must provide accurate registration information and keep your
              credentials confidential. You are responsible for everything that
              happens under your account, including activity by anyone you share
              access with. Notify us immediately at{" "}
              <a
                href="mailto:mrluisfeer@gmail.com"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                mrluisfeer@gmail.com
              </a>{" "}
              if you suspect unauthorized access.
            </p>
          </LegalSection>

          <LegalSection id="user-content" index={4} title="Your Content">
            <p>
              You retain all rights to the data, transactions, and notes you
              upload to Monfly ("Your Content"). You grant us a limited,
              non-exclusive license to host, process, and display Your Content
              solely to provide the service to you.
            </p>
            <p>
              You are solely responsible for the accuracy and legality of Your
              Content. Do not upload information that you are not authorized to
              share.
            </p>
          </LegalSection>

          <LegalSection id="acceptable-use" index={5} title="Acceptable Use">
            <p>You agree not to:</p>
            <ul className="ml-1 list-inside list-disc space-y-1.5">
              <li>
                Reverse engineer, scrape, or attempt to bypass authentication or
                rate limiting.
              </li>
              <li>
                Use the service to store or transmit malicious code or content
                that infringes the rights of others.
              </li>
              <li>
                Resell, sublicense, or use Monfly to provide a competing service
                without written permission.
              </li>
              <li>
                Attempt to access another user's workspace or aggregate user
                data without consent.
              </li>
            </ul>
          </LegalSection>

          <LegalSection
            id="availability"
            index={6}
            title="Availability & Changes"
          >
            <p>
              We work to keep Monfly available and reliable, but we do not
              guarantee uninterrupted access. We may add, modify, or remove
              features at any time. If a change materially affects your usage,
              we will provide reasonable notice through the application or via
              email.
            </p>
          </LegalSection>

          <LegalSection id="pricing" index={7} title="Pricing & Free Tier">
            <p>
              Monfly currently offers free access while the product is in active
              development. If we introduce paid plans, pricing will be displayed
              on the{" "}
              <a
                href="/#pricing"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                pricing section
              </a>{" "}
              and you will be asked to opt in before being charged.
            </p>
          </LegalSection>

          <LegalSection id="termination" index={8} title="Termination">
            <p>
              You may close your account at any time from the user settings. We
              may suspend or terminate accounts that violate these Terms, create
              risk for the platform, or are inactive for prolonged periods. Upon
              termination your right to use the service ends, but provisions
              that by their nature should survive will remain in effect.
            </p>
          </LegalSection>

          <LegalSection id="disclaimers" index={9} title="Disclaimers">
            <p>
              The service is provided <em>"as is"</em> and{" "}
              <em>"as available"</em>, without warranties of any kind, whether
              express or implied. We do not warrant that the dashboard will be
              error-free, secure against every possible threat, or suitable for
              a specific purpose.
            </p>
          </LegalSection>

          <LegalSection
            id="liability"
            index={10}
            title="Limitation of Liability"
          >
            <p>
              To the maximum extent permitted by law, Monfly and its
              contributors will not be liable for any indirect, incidental,
              special, or consequential damages, or for any loss of profits,
              revenue, data, or goodwill arising from your use of the service.
            </p>
          </LegalSection>

          <LegalSection id="governing-law" index={11} title="Governing Law">
            <p>
              These Terms are governed by the laws of the jurisdiction where the
              operator of Monfly is established, without regard to its conflict
              of laws rules. Any disputes will be resolved by the competent
              courts of that jurisdiction, unless mandatory consumer protection
              law dictates otherwise.
            </p>
          </LegalSection>

          <LegalSection id="updates" index={12} title="Updates to These Terms">
            <p>
              We may update these Terms from time to time. The "last updated"
              date reflects the most recent revision. Continued use of the
              service after changes take effect constitutes acceptance of the
              updated Terms.
            </p>
          </LegalSection>

          <LegalSection id="contact" index={13} title="Contact">
            <p>
              Questions about these Terms? Reach out via the{" "}
              <Link
                to="/contact"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                contact page
              </Link>{" "}
              or email{" "}
              <a
                href="mailto:mrluisfeer@gmail.com"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                mrluisfeer@gmail.com
              </a>
              .
            </p>
          </LegalSection>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 text-emerald-600 dark:text-emerald-300" />
            <div>
              <p className="text-foreground text-sm font-semibold">Summary</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Use Monfly for personal finance, keep your credentials safe, and
                don't try to break things. We'll keep the service running fairly
                and let you know before anything material changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </LegalLayout>
  );
}
