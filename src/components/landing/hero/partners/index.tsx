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
    <div className="flex gap-5 items-center justify-center">
      {partners.map((partner) => (
        <div
          key={partner.name}
          className="transition opacity-60 hover:opacity-100"
          aria-label={partner.name}
        >
          {partner.icon ? (
            partner.icon
          ) : (
            <img
              src={partner.image!}
              alt={partner.name}
              className="h-6 object-contain"
              loading="lazy"
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  );
};
