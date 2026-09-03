import { Link } from "@tanstack/react-router";
import {
  ArrowUpIcon,
  FileText,
  GitBranchIcon,
  Mail,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const legalLinks = [
  { icon: Shield, label: "Privacy", to: "/privacy" },
  { icon: FileText, label: "Terms", to: "/terms" },
  { icon: Mail, label: "Contact", to: "/contact" },
] as const;

const Footer = () => {
  const year = new Date().getFullYear();
  const scrollToTop = () => {
    window.scrollTo({ behavior: "smooth", left: 0, top: 0 });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-40px", once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-8 text-muted-foreground text-xs sm:text-sm"
    >
      <Separator className="mb-4 bg-border/60 sm:mb-5 dark:bg-border/40" />

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex flex-wrap items-center justify-center gap-1.5 md:justify-start">
          <span className="font-semibold text-foreground tracking-tight">
            Monfly
          </span>
          <span className="text-muted-foreground/60" aria-hidden>
            ·
          </span>
          <span>© {year}</span>
          <span
            className="hidden text-muted-foreground/60 sm:inline"
            aria-hidden
          >
            ·
          </span>
          <span className="hidden sm:inline">All rights reserved</span>
        </p>

        <nav
          aria-label="Legal"
          className="-mx-1 flex flex-wrap items-center justify-start gap-0.5 sm:mx-0 sm:justify-end sm:gap-2"
        >
          {legalLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:px-2.5 dark:hover:bg-accent/60"
              activeProps={{
                className:
                  "text-foreground bg-accent/70 dark:bg-accent/40 dark:text-foreground",
              }}
            >
              <Icon
                className="size-3.5 transition-transform group-hover:scale-110"
                aria-hidden
              />
              <span>{label}</span>
            </Link>
          ))}

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-4 bg-border/60 sm:block dark:bg-border/40"
          />

          <Tooltip>
            <TooltipTrigger
              render={<Button size={"icon"} onClick={scrollToTop} />}
            >
              <ArrowUpIcon />
            </TooltipTrigger>
            <TooltipContent side="top">Back to top</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://github.com/mrluisfer/monfly"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                  className="ml-auto inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:ml-0 dark:hover:bg-accent/60"
                >
                  <GitBranchIcon className="size-4" aria-hidden />
                </a>
              }
            />
            <TooltipContent side="top">View source on GitHub</TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </motion.footer>
  );
};

export default Footer;
