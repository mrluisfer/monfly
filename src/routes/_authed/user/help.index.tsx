import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenIcon,
  FolderTreeIcon,
  HandCoinsIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  MailIcon,
  MessageCircleQuestionIcon,
  ReceiptIcon,
  SparklesIcon,
} from "lucide-react";

import { PageHeader } from "~/components/layout/PageHeader";
import { Section } from "~/components/layout/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Kbd } from "~/components/ui/kbd";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/_authed/user/help/")({
  component: HelpRoute,
});

interface QuickLink {
  accent: string;
  description: string;
  icon: LucideIcon;
  title: string;
  to: string;
}

const quickLinks: QuickLink[] = [
  {
    title: "Overview",
    description:
      "Your balance, monthly cashflow and recent activity at a glance.",
    icon: LayoutDashboardIcon,
    to: "/home",
    accent: "bg-primary/10 text-primary",
  },
  {
    title: "Transactions",
    description: "Log income and expenses. Filter, search and edit anytime.",
    icon: ReceiptIcon,
    to: "/home/transactions",
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Categories",
    description: "Organize spending with custom categories and icons.",
    icon: FolderTreeIcon,
    to: "/home/categories",
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Loans",
    description: "Track money others owe you and what you owe to others.",
    icon: HandCoinsIcon,
    to: "/home/loans",
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

interface Faq {
  a: string;
  q: string;
}

const faqs: Faq[] = [
  {
    q: "How is my balance calculated?",
    a: "Your total balance is the sum of every income transaction minus every expense, across all categories. Loans don't affect the balance until a payment is registered as a real transaction.",
  },
  {
    q: "What's the difference between an income loan and a regular income?",
    a: "A loan tagged as ‘Owed to me’ represents money you expect to receive — it doesn't move your balance. When the debtor pays, you record a regular income transaction (optionally linked to the loan) and the balance updates.",
  },
  {
    q: "Can I edit a category after creating transactions with it?",
    a: "Yes. Renaming a category updates how it's displayed everywhere, and your historical transactions stay grouped under the new name automatically.",
  },
  {
    q: "What happens when I delete a category?",
    a: "Transactions previously assigned to that category keep their value but lose the visual grouping. To preserve history, prefer renaming or hiding a category instead of deleting.",
  },
  {
    q: "Is my data private?",
    a: "Yes — every record is scoped to your account email. Other users can't see or query your transactions, categories, or loans. Sessions are encrypted with a server-side secret.",
  },
  {
    q: "Can I export my data?",
    a: "An export option for CSV/JSON is on the roadmap. In the meantime, contact support if you need a one-off backup.",
  },
];

interface Shortcut {
  description: string;
  keys: string[];
}

const shortcuts: Shortcut[] = [
  { keys: ["Esc"], description: "Close dialogs and drawers" },
  { keys: ["Tab"], description: "Move focus between fields" },
  { keys: ["Enter"], description: "Submit the focused form" },
  { keys: ["/"], description: "Focus the search field in lists" },
];

function HelpRoute() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        icon={<LifeBuoyIcon className="size-5" aria-hidden="true" />}
        title="Help & support"
        description="Quick guides, common questions, and shortcuts to get the most out of Monfly."
        actions={
          <Badge variant="default" className="gap-1.5">
            <SparklesIcon className="size-3" aria-hidden="true" />
            We&apos;re listening
          </Badge>
        }
      />

      <Section
        title="Jump to a section"
        description="Each area has its own dedicated workspace."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-border hover:bg-accent/30 hover:shadow-md"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${link.accent}`}
                >
                  <Icon className="size-5" />
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm tracking-tight">
                    {link.title}
                  </p>
                  <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section
        title="Frequently asked questions"
        description="Short answers to the most common questions about how Monfly works."
      >
        <Accordion className="divide-y divide-border/60 border-border/60 bg-card">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className={"px-2"}>
              <AccordionTrigger className="text-left font-medium text-sm">
                <span className="flex items-center gap-2">
                  <MessageCircleQuestionIcon
                    className="size-4 shrink-0 text-muted-foreground transition-colors group-aria-expanded/accordion-trigger:text-primary"
                    aria-hidden="true"
                  />
                  {faq.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Section
          title="Keyboard shortcuts"
          description="Move faster with the keyboard."
        >
          <ul
            role="list"
            className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card"
          >
            {shortcuts.map((shortcut) => (
              <li
                key={shortcut.description}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="text-foreground text-sm">
                  {shortcut.description}
                </span>
                <span className="flex items-center gap-1">
                  {shortcut.keys.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Best practices"
          description="A few habits that keep your tracking accurate."
        >
          <ul
            role="list"
            className="space-y-3 rounded-2xl border border-border/60 bg-card p-4"
          >
            {[
              "Log transactions the same day to avoid forgetting context.",
              "Use specific categories — ‘Coffee’ tells you more than ‘Other’.",
              "Mark loans as paid promptly so receivables reflect reality.",
              "Review the dashboard weekly to spot unusual spikes early.",
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-foreground text-sm"
              >
                <ListChecksIcon
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        title="Privacy & data"
        description="What we store and how we protect it."
      >
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-start sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <LockKeyholeIcon className="size-5" />
          </span>
          <div className="space-y-2 text-sm leading-relaxed">
            <p className="text-foreground">
              Your transactions, categories, loans and balance are stored under
              your account and never shared with other users. Sessions use
              encrypted cookies and passwords are hashed with bcrypt.
            </p>
            <p className="text-muted-foreground">
              We don&apos;t sell, analyze or share your personal finance data
              with third parties.
            </p>
          </div>
        </div>
      </Section>

      <Separator className="bg-border/60" />

      <Section
        title="Still need a hand?"
        description="Reach out and we'll get back to you as soon as we can."
      >
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <BookOpenIcon className="size-5" />
            </span>
            <div className="space-y-1">
              <p className="font-medium text-foreground text-sm">
                Contact support
              </p>
              <p className="text-muted-foreground text-xs">
                Bug reports, feature requests, or just a question — we read
                every message.
              </p>
            </div>
          </div>
          <Button
            nativeButton={false}
            render={<a href="mailto:support@monfly.app" />}
          >
            <MailIcon aria-hidden="true" />
            Email support
          </Button>
        </div>
      </Section>
    </div>
  );
}
