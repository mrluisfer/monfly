import { ReactNode } from "react";
import Card from "~/components/card";

type PricingCardProps = {
  title: ReactNode;
  children: ReactNode;
};

export function PricingCard({ title, children }: PricingCardProps) {
  return (
    <Card
      title={
        <h3 className="text-[3rem] font-bold flex items-center">{title}</h3>
      }
      className="bg-gradient-to-b from-primary/20 via-white to-white mt-10 dark:from-primary/20 dark:via-zinc-900 dark:to-zinc-950"
    >
      {children}
    </Card>
  );
}
