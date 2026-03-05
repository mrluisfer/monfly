import { Link } from "@tanstack/react-router";

import LogoSvg from "../../assets/logo.svg";

export function Logo() {
  return (
    <Link
      to="/home"
      className="flex w-fit items-center gap-2.5 text-xl font-bold md:me-4 md:text-2xl"
    >
      <img
        src={LogoSvg}
        alt="Monfly Logo"
        className="h-6 w-6 md:h-8 md:w-8"
        title="Monfly"
      />
      <span className="sidebar-title-text hidden font-[family-name:var(--font-syne)] md:block">
        Monfly
      </span>
    </Link>
  );
}
