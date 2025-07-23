import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { ShinyButton } from "../magicui/shiny-button";
import { Typography } from "../typography";
import { Button } from "../ui/button";

const partners: { name: string; image: string | ReactNode }[] = [
  {
    name: "Visa",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
  },
  {
    name: "Stripe",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
  },
  {
    name: "Paypal",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
  },
  {
    name: "Apple Pay",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
];

export function LandingHero() {
  return (
    <section className="bg-[url(/root-chart.svg)] bg-top bg-no-repeat bg-cover mt-16">
      <div className="max-w-3xl mx-auto pb-12 flex flex-col md:flex-row gap-10 items-center justify-between">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-center">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 text-center">
              Track, optimize, grow, and manage your money through every stage
              of life.
            </span>
          </div>
          <div className="flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-center">
              Empower Your{" "}
              <span className="text-primary">Personal Financial</span> Journey
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground max-w-md text-center">
              Take control of your income, expenses, budgets and goals, all in
              one place. Modern technology, expert insights, and limitless
              potential.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <Button
              size="lg"
              className="mt-4 font-semibold max-w-[350px] mx-auto"
              asChild
            >
              <ShinyButton>
                <Link to="/signup" className="text-white">
                  Start Your Journey
                </Link>
              </ShinyButton>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <Link to="/login">Already have an account?</Link>
            </Button>
          </div>
          <div className="flex gap-4 mt-6 items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Our Trusted Partners:
            </span>
            <div className="flex gap-5 items-center justify-center">
              {partners.map((partner) => (
                <img
                  key={partner.name}
                  src={partner.image as string}
                  alt={partner.name}
                  className="h-6 transition opacity-60 hover:opacity-100 object-contain"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center mt-16">
            <Typography asChild variant="foreground">
              <blockquote className="italic text-sm max-w-sm flex-1 border bg-gray-50 pt-2 rounded-[1rem] px-4 py-2">
                <Typography variant="muted">“</Typography>
                <span className="text-primary">Monfly</span> makes tracking my
                spending effortless. I feel confident knowing my data is secure.
                <Typography variant="muted">”</Typography>
                <br />
                <span className="not-italic font-bold text-foreground text-sm">
                  – Jane Doe
                </span>
              </blockquote>
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
