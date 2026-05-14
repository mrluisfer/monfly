import { Link } from "@tanstack/react-router";

import Logo from "../../../assets/logo.svg";

export function HeaderLogo() {
  return (
    <Link
      to="/"
      className="group border-border/75 bg-background/85 hover:border-primary/50 hover:bg-background inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-150 ease-out"
    >
      <span className="border-border/65 bg-background relative flex size-7 items-center justify-center rounded-full border">
        <img src={Logo} alt="Monfly Logo" className="size-4.5 w-auto" />
      </span>
      <span className="text-foreground group-hover:text-primary font-[family-name:var(--font-syne)] text-xs font-bold tracking-[0.2em] transition-colors">
        MONFLY
      </span>
    </Link>
  );
}
