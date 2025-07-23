import { TextAnimate } from "~/components/magicui/text-animate";

import Logo from "../../../assets/logo.svg";

export function HeaderLogo() {
  return (
    <a
      href="#"
      className="text-primary hover:text-primary/90 flex items-center gap-2"
    >
      <img src={Logo} alt="Monfly Logo" className="size-8 w-auto" />
      <TextAnimate
        animation="slideLeft"
        by="character"
        className="text-black dark:text-white font-bold"
      >
        MONFLY
      </TextAnimate>
    </a>
  );
}
