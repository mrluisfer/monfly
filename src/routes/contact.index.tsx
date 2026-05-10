import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  GitBranchPlusIcon,
  LifeBuoy,
  Mail,
  MessageSquareHeart,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/contact/")({
  head: () => ({
    title: "Contact | Monfly",
    meta: [
      {
        name: "description",
        content:
          "Reach the Monfly team — product questions, bug reports, privacy requests, and partnership inquiries.",
      },
    ],
  }),
  component: ContactRoute,
});

const channels = [
  {
    icon: Mail,
    label: "General & support",
    target: "mrluisfeer@gmail.com",
    href: "mailto:mrluisfeer@gmail.com",
    description:
      "Product questions, bug reports, billing, or anything you need a human for.",
    tone: "text-teal-600 dark:text-teal-300",
    cta: "Send email",
  },
  {
    icon: ShieldCheck,
    label: "Privacy & data requests",
    target: "mrluisfeer@gmail.com",
    href: "mailto:mrluisfeer@gmail.com?subject=Privacy%20Request",
    description:
      "Access, deletion, or portability of your personal data under applicable privacy laws.",
    tone: "text-emerald-600 dark:text-emerald-300",
    cta: "Open request",
  },
  {
    icon: GitBranchPlusIcon,
    label: "Open source & issues",
    target: "github.com/mrluisfer/monfly",
    href: "https://github.com/mrluisfer/monfly/issues",
    description:
      "Report bugs, request features, or contribute directly to the codebase.",
    tone: "text-amber-600 dark:text-amber-300",
    cta: "Open repository",
    external: true,
  },
];

const faqs = [
  {
    question: "How fast do you respond?",
    answer:
      "We aim to reply to email within two business days. Privacy requests are prioritized.",
  },
  {
    question: "Can I request a feature?",
    answer:
      "Absolutely. Open an issue on GitHub or write us — community ideas shape the roadmap.",
  },
  {
    question: "Do you offer phone support?",
    answer:
      "Not yet. Email and GitHub are the fastest channels and keep a written history for both sides.",
  },
];

function ContactRoute() {
  return (
    <LegalLayout
      eyebrow="Contact"
      breadcrumb="Contact"
      title="Talk to the Monfly team"
      description="We read every message. Pick the channel that best fits what you need and we'll get back to you with a real human reply."
      lastUpdated="May 9, 2026"
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {channels.map((channel, index) => (
          <Card
            key={channel.label}
            className="landing-fade-up"
            style={
              {
                animationDelay: `${index * 0.07 + 0.05}s`,
              } as React.CSSProperties
            }
          >
            <CardContent className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-2">
                <channel.icon className={`size-5 ${channel.tone}`} />
                <Badge variant="secondary" className="uppercase tracking-wide">
                  {channel.label}
                </Badge>
              </div>
              <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground">
                {channel.target}
              </p>
              <p className="text-sm text-muted-foreground">
                {channel.description}
              </p>
              <div className="mt-auto pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  render={
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener" }
                        : {})}
                    >
                      {channel.cta}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="size-5 text-teal-600 dark:text-teal-300" />
              <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground">
                Send us a quick message
              </p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Prefer a guided form? This composer opens your email client with
              everything pre-filled.
            </p>

            <ContactComposer />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <LifeBuoy className="size-5 text-amber-600 dark:text-amber-300" />
              <p className="font-[family-name:var(--font-syne)] text-lg font-semibold text-foreground">
                Frequently asked
              </p>
            </div>

            <ul className="mt-4 space-y-4">
              {faqs.map((faq) => (
                <li
                  key={faq.question}
                  className="rounded-2xl border border-border/60 bg-background/72 p-3"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {faq.question}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {faq.answer}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card size="sm" className="mt-6">
        <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Looking for legal information?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Read our Privacy Policy and Terms & Conditions for the full
              picture.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              render={<Link to="/privacy">Privacy Policy</Link>}
            />
            <Button
              variant="secondary"
              size="sm"
              render={<Link to="/terms">Terms & Conditions</Link>}
            />
          </div>
        </CardContent>
      </Card>
    </LegalLayout>
  );
}

function ContactComposer() {
  return (
    <form
      className="mt-4 grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const subject = encodeURIComponent(
          String(data.get("subject") ?? "Hello from Monfly")
        );
        const body = encodeURIComponent(
          `${String(data.get("message") ?? "")}\n\n— ${String(
            data.get("name") ?? ""
          )}`
        );
        window.location.href = `mailto:mrluisfeer@gmail.com?subject=${subject}&body=${body}`;
      }}
    >
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Your name
        <input
          name="name"
          required
          autoComplete="name"
          placeholder="Jane Doe"
          className="rounded-2xl border border-border/65 bg-background/80 px-3 py-2 text-sm text-foreground outline-none ring-0 transition focus:border-foreground/40"
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Subject
        <input
          name="subject"
          required
          placeholder="What is this about?"
          className="rounded-2xl border border-border/65 bg-background/80 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/40"
        />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Message
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Tell us what you need…"
          className="resize-none rounded-2xl border border-border/65 bg-background/80 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/40"
        />
      </label>
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-[0.7rem] uppercase tracking-[0.13em] text-muted-foreground">
          Opens your email client
        </p>
        <Button type="submit" size="sm">
          Send message
          <ArrowUpRight className="size-3.5" />
        </Button>
      </div>
    </form>
  );
}
