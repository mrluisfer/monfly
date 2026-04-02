import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import LogoSvg from "../../assets/logo.svg";

export function Logo({ withTitle = true }: { withTitle?: boolean }) {
  return (
    <Link
      to="/home"
      className={cn(
        "flex w-fit items-center gap-2.5 text-xl font-bold md:text-2xl",
        withTitle ? "md:me-4" : "md:me-0"
      )}
    >
      <img
        src={LogoSvg}
        alt="Monfly Logo"
        className="h-6 w-6 md:h-8 md:w-8"
        title="Monfly"
      />
      {withTitle && (
        <span className="sidebar-title-text hidden font-[family-name:var(--font-syne)] md:block">
          Monfly
        </span>
      )}
    </Link>
  );
}
