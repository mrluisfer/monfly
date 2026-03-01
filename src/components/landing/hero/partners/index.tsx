import { ReactNode } from "react";
import { useDarkMode } from "~/hooks/use-dark-mode";

import { AppleDark } from "./apple-dark";
import { AppleLight } from "./apple-light";
import { PayPal } from "./paypal";
import { StripeLight } from "./stripe-light";

type PartnerType =
  | {
      name: string;
      icon: ReactNode;
      image?: undefined;
    }
  | {
      name: string;
      image: string;
      icon?: ReactNode;
    };

const getPartners = (isDark: boolean): PartnerType[] => [
  {
    name: "Visa",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
  },
  {
    name: "Stripe",
    icon: <StripeLight className="size-16" />,
  },
  {
    name: "Paypal",
    icon: <PayPal className="size-8" />,
  },
  {
    name: "Apple Pay",
    icon: isDark ? (
      <AppleDark className="size-8" />
    ) : (
      <AppleLight className="size-8" />
    ),
  },
];

export const Partners = () => {
  const { isDark } = useDarkMode();
  const partners = getPartners(isDark);

  return (
    <ul
      className="flex flex-wrap items-center gap-2 sm:gap-3"
      aria-label="Trusted partners"
    >
      {partners.map((partner) => (
        <li
          key={partner.name}
          aria-label={partner.name}
          className="inline-flex h-9 items-center justify-center rounded-full border border-border/60 bg-background/85 px-3 transition-colors duration-150 ease-out hover:border-primary/30 hover:bg-background"
        >
          {partner.icon ? (
            partner.icon
          ) : (
            <img
              src={partner.image!}
              alt={partner.name}
              className="h-4 object-contain"
              loading="lazy"
              draggable={false}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
