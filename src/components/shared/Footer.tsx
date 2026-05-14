import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { FileText, GitBranchIcon, Mail, Shield } from "lucide-react";

import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const legalLinks = [
  { to: "/privacy", label: "Privacy", icon: Shield },
  { to: "/terms", label: "Terms", icon: FileText },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-muted-foreground mt-8 text-xs sm:text-sm"
    >
      <Separator className="bg-border/60 dark:bg-border/40 mb-4 sm:mb-5" />

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex flex-wrap items-center justify-center gap-1.5 md:justify-start">
          <span className="text-foreground font-semibold tracking-tight">
            Monfly
          </span>
          <span className="text-muted-foreground/60" aria-hidden>
            ·
          </span>
          <span>© {year}</span>
          <span
            className="text-muted-foreground/60 hidden sm:inline"
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
              className="group hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:ring-ring dark:hover:bg-accent/60 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none sm:px-2.5"
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
            className="bg-border/60 dark:bg-border/40 mx-1 hidden h-4 sm:block"
          />

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://github.com/mrluisfer/monfly"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                  className="hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:ring-ring dark:hover:bg-accent/60 ml-auto inline-flex size-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none sm:ml-0"
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
