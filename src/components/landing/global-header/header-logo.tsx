import { Link } from "@tanstack/react-router";

import Logo from "../../../assets/logo.svg";

export function HeaderLogo() {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2 rounded-full border border-border/75 bg-background/85 px-3 py-1.5 transition-colors duration-150 ease-out hover:border-primary/50 hover:bg-background"
    >
      <span className="relative flex size-7 items-center justify-center rounded-full border border-border/65 bg-background">
        <img src={Logo} alt="Monfly Logo" className="size-4.5 w-auto" />
      </span>
      <span className="font-[family-name:var(--font-syne)] text-xs font-bold tracking-[0.2em] text-foreground transition-colors group-hover:text-primary">
        MONFLY
      </span>
    </Link>
  );
}
