import { Link } from "@tanstack/react-router";

import { Typography } from "../../typography";
import { Button } from "../../ui/button";
import { Partners } from "./partners";

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
            <Link to="/signup" className="text-white">
              <Button
                size="lg"
                className="mt-4 font-semibold max-w-[350px] mx-auto"
              >
                Start Your Journey
              </Button>
            </Link>
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
            <Partners />
          </div>
          <div className="flex items-center justify-center mt-16">
            <blockquote className="italic text-sm max-w-sm flex-1 border bg-gray-50 dark:bg-zinc-800 pt-2 rounded-[1rem] px-4 py-2">
              <Typography variant="muted">“</Typography>
              <span className="text-primary">Monfly</span> makes tracking my
              spending effortless. I feel confident knowing my data is secure.
              <Typography variant="muted">”</Typography>
              <br />
              <span className="not-italic font-semibold text-primary text-xs">
                – Jane Doe
              </span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
