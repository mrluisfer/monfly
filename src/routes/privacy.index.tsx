import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cookie,
  Database,
  KeyRound,
  Mail,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/privacy/")({
  head: () => ({
    title: "Privacy Policy | Monfly",
    meta: [
      {
        name: "description",
        content:
          "How Monfly collects, stores, and protects the personal and financial data you share with our personal finance dashboard.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyRoute,
});

const highlights = [
  {
    icon: ShieldCheck,
    title: "Encryption at rest",
    description:
      "Sensitive fields are stored on managed infrastructure with industry-standard encryption.",
    tone: "text-emerald-600 dark:text-emerald-300",
  },
  {
    icon: KeyRound,
    title: "Hashed credentials",
    description:
      "Passwords are never stored in plain text — we use bcrypt with per-user salts.",
    tone: "text-teal-600 dark:text-teal-300",
  },
  {
    icon: UserCheck,
    title: "You own your data",
    description:
      "Export, edit, or delete your workspace at any time from your account settings.",
    tone: "text-amber-600 dark:text-amber-300",
  },
];

function PrivacyRoute() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      breadcrumb="Privacy Policy"
      title="Privacy Policy"
      description="This policy explains what data Monfly collects when you create an account, how we use it to power your dashboard, and the choices you have over it."
      lastUpdated="May 9, 2026"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {highlights.map((item, index) => (
          <Card
            key={item.title}
            size="sm"
            className="landing-fade-up"
            style={
              {
                animationDelay: `${index * 0.07 + 0.05}s`,
              } as React.CSSProperties
            }
          >
            <CardContent>
              <item.icon className={`size-5 ${item.tone}`} />
              <p className="text-foreground mt-2 text-sm font-semibold">
                {item.title}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent>
          <LegalSection id="introduction" index={1} title="Introduction">
            <p>
              Monfly ("we", "our", "us") provides a personal finance dashboard
              that helps individuals track expenses, plan budgets, and visualize
              financial decisions. This Privacy Policy describes how we handle
              the personal information of users ("you") who interact with the
              service.
            </p>
            <p>
              By creating an account or using Monfly you agree to the practices
              described here. If you do not agree, please discontinue use of the
              service.
            </p>
          </LegalSection>

          <LegalSection
            id="data-we-collect"
            index={2}
            title="Information We Collect"
          >
            <p>
              We only collect what is necessary to operate the dashboard. The
              categories below reflect the data currently handled by Monfly:
            </p>
            <ul className="ml-1 list-inside list-disc space-y-1.5">
              <li>
                <strong className="text-foreground">Account data:</strong> name,
                email address, and a securely hashed password used to
                authenticate your sessions.
              </li>
              <li>
                <strong className="text-foreground">Financial entries:</strong>{" "}
                transactions, categories, budgets, pots, recurring bills, cards,
                and monthly summaries that you create inside Monfly.
              </li>
              <li>
                <strong className="text-foreground">Preferences:</strong>{" "}
                interface preferences such as theme, locale, font display, and
                haptic feedback.
              </li>
              <li>
                <strong className="text-foreground">Operational data:</strong>{" "}
                minimal request metadata (timestamps, rate-limit counters)
                required to keep the service stable and secure.
              </li>
            </ul>
            <p>
              Monfly does not connect directly to your bank accounts. All
              financial entries exist because you entered or imported them
              manually.
            </p>
          </LegalSection>

          <LegalSection id="how-we-use" index={3} title="How We Use Your Data">
            <p>We use the information above strictly to:</p>
            <ul className="ml-1 list-inside list-disc space-y-1.5">
              <li>Authenticate you and keep your workspace private.</li>
              <li>
                Render dashboards, charts, reports, and forecasts from the
                entries you create.
              </li>
              <li>
                Operate the platform safely (rate limiting, abuse prevention,
                debugging).
              </li>
              <li>
                Communicate transactional information related to your account
                when strictly necessary.
              </li>
            </ul>
            <p>
              We do not sell your personal data, and we do not use your
              financial entries to train third-party advertising models.
            </p>
          </LegalSection>

          <LegalSection
            id="legal-basis"
            index={4}
            title="Legal Basis for Processing"
          >
            <p>
              Where applicable (for example under the GDPR or comparable
              regimes), we rely on the following legal bases: performance of the
              contract you accept by signing up, our legitimate interest in
              keeping the service operational and secure, your consent for
              optional features, and legal obligations.
            </p>
          </LegalSection>

          <LegalSection
            id="storage"
            index={5}
            title="Storage, Retention & Security"
          >
            <p>
              Account and financial data is stored in a managed PostgreSQL
              database. Sessions are issued through encrypted, signed cookies.
              Passwords are hashed with bcrypt before being persisted.
            </p>
            <p>
              We retain your data while your account is active. When you delete
              your account, the associated records are removed from our active
              systems within a reasonable period, except where retention is
              required to comply with legal obligations.
            </p>
            <p>
              No online service can be guaranteed to be 100% secure, but we
              follow widely accepted practices to reduce the risk of
              unauthorized access.
            </p>
          </LegalSection>

          <LegalSection
            id="third-parties"
            index={6}
            title="Third-Party Providers"
          >
            <p>
              Monfly relies on a small number of infrastructure providers
              (hosting, database, email delivery, error tracking) that process
              data only on our behalf and under contractual obligations. We do
              not share your information with advertisers.
            </p>
          </LegalSection>

          <LegalSection id="cookies" index={7} title="Cookies & Local Storage">
            <p>
              We use a session cookie to keep you logged in and minimal local
              storage to remember interface preferences. Monfly does not use
              third-party advertising or cross-site tracking cookies.
            </p>
          </LegalSection>

          <LegalSection id="rights" index={8} title="Your Rights">
            <p>Depending on your jurisdiction you may have the right to:</p>
            <ul className="ml-1 list-inside list-disc space-y-1.5">
              <li>Access a copy of the data we hold about you.</li>
              <li>Correct inaccurate or incomplete information.</li>
              <li>Delete your account and associated workspace data.</li>
              <li>Object to certain processing activities.</li>
              <li>Export your data in a machine-readable format.</li>
            </ul>
            <p>
              You can exercise most of these rights directly inside the
              application. For everything else, contact us at the address listed
              below.
            </p>
          </LegalSection>

          <LegalSection id="children" index={9} title="Children">
            <p>
              Monfly is not directed to children under 13 and we do not
              knowingly collect personal information from them. If you believe a
              child has provided us with personal information, please contact us
              so we can take appropriate action.
            </p>
          </LegalSection>

          <LegalSection id="changes" index={10} title="Changes to This Policy">
            <p>
              We may update this Privacy Policy as the product evolves. The
              "last updated" date at the top reflects the most recent revision.
              Material changes will be communicated through the application or
              by email when appropriate.
            </p>
          </LegalSection>

          <LegalSection id="contact" index={11} title="Contact">
            <p>
              For privacy-related questions, write to{" "}
              <a
                href="mailto:mrluisfeer@gmail.com"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                mrluisfeer@gmail.com
              </a>{" "}
              or visit the{" "}
              <Link
                to="/contact"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                contact page
              </Link>
              .
            </p>
          </LegalSection>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card size="sm">
          <CardContent className="flex items-start gap-3">
            <Database className="mt-0.5 size-5 text-teal-600 dark:text-teal-300" />
            <div>
              <p className="text-foreground text-sm font-semibold">
                Data portability
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Export your transactions, budgets, and reports whenever you need
                them.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-start gap-3">
            <Scale className="mt-0.5 size-5 text-amber-600 dark:text-amber-300" />
            <div>
              <p className="text-foreground text-sm font-semibold">
                Compliance-ready
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Designed with GDPR, CCPA, and similar privacy regimes in mind.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-start gap-3">
            <Cookie className="mt-0.5 size-5 text-emerald-600 dark:text-emerald-300" />
            <div>
              <p className="text-foreground text-sm font-semibold">
                Minimal cookies
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Only the essentials we need to keep your session alive.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-sky-600 dark:text-sky-300" />
            <div>
              <p className="text-foreground text-sm font-semibold">
                Direct line
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Real humans answer privacy requests at mrluisfeer@gmail.com.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LegalLayout>
  );
}
