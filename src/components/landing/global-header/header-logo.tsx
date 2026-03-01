import { Link } from "@tanstack/react-router";
import { TextAnimate } from "~/components/magicui/text-animate";

import Logo from "../../../assets/logo.svg";

export function HeaderLogo() {
  return (
    <Link
      to="/"
      className="text-primary hover:text-primary/90 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-2.5 py-1.5 transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-background/95"
    >
      <img src={Logo} alt="Monfly Logo" className="size-7 w-auto" />
      <TextAnimate
        animation="slideLeft"
        by="character"
        className="font-[family-name:var(--font-space-mono)] text-[0.7rem] font-semibold tracking-[0.28em] text-foreground"
      >
        MONFLY
      </TextAnimate>
    </Link>
  );
}
