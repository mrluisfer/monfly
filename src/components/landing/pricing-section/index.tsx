import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import {
  Check,
  Clock3,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { DotPattern } from "../../magicui/dot-pattern";
import { BillingCard } from "./billing-card";
import { BillingLabel } from "./billing-label";
import { EnterpriseCard } from "./enterprise-card";

type PlanId = "starter" | "pro" | "enterprise";

type PlanOption = {
  id: PlanId;
  name: string;
  description: string;
  monthly: string;
  annual: string;
  features: string[];
  accent: string;
};

type ValueTile = {
  title: string;
  description: string;
  meta: string;
  icon: ReactNode;
};

const planOptions: PlanOption[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfecto para uso personal y control diario.",
    monthly: "$5/mo",
    annual: "$60/year",
    features: [
      "Transacciones y categorías ilimitadas",
      "Alertas básicas de presupuesto",
      "Dashboard optimizado para móvil",
    ],
    accent: "from-emerald-500/25 to-teal-500/10",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Planeación avanzada para usuarios con objetivos claros.",
    monthly: "$12/mo",
    annual: "$120/year",
    features: [
      "Escenarios y proyecciones de cashflow",
      "Reglas inteligentes de categorización",
      "Reportes accionables por periodos",
    ],
    accent: "from-orange-400/30 to-amber-400/10",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Gobernanza, seguridad y soporte para equipos financieros.",
    monthly: "Custom",
    annual: "Contract",
    features: [
      "Permisos por rol y trazabilidad",
      "Onboarding dedicado y migración",
      "Acuerdos de soporte y cumplimiento",
    ],
    accent: "from-sky-500/25 to-indigo-500/10",
  },
];

const valueTiles: ValueTile[] = [
  {
    title: "Setup rápido",
    meta: "< 3 min",
    description: "Configura categorías, objetivos y límites sin fricción.",
    icon: <Clock3 className="size-4 text-primary" />,
  },
  {
    title: "Visión accionable",
    meta: "Realtime",
    description: "Detecta desviaciones antes de que impacten tu mes.",
    icon: <TrendingUp className="size-4 text-primary" />,
  },
  {
    title: "Control granular",
    meta: "Flexible",
    description: "Estructura gastos e ingresos por contexto real de uso.",
    icon: <LayoutGrid className="size-4 text-primary" />,
  },
  {
    title: "Seguridad",
    meta: "Protected",
    description: "Sesiones cifradas con flujos seguros por defecto.",
    icon: <ShieldCheck className="size-4 text-primary" />,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");
  const shouldReduceMotion = useReducedMotion();

  const selectedPlanData =
    planOptions.find((plan) => plan.id === selectedPlan) ?? planOptions[1];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="px-4 pb-18 pt-10 sm:px-6 md:pb-24 md:pt-14"
    >
      <LazyMotion features={domAnimation}>
        <m.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          className="mx-auto max-w-6xl"
        >
          <div className="landing-glass-panel relative overflow-hidden rounded-[2rem] border border-border/70 px-4 py-8 sm:px-8 md:px-10 md:py-11">
            <DotPattern
              className="opacity-35 [mask-image:radial-gradient(650px_circle_at_top,white,transparent)]"
              glow
            />

            <div className="relative z-10 space-y-7">
              <div className="mx-auto max-w-3xl space-y-3 text-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="size-3.5" />
                  Flexible Plans
                </p>
                <h2
                  id="pricing-title"
                  className="text-balance font-[family-name:var(--font-syne)] text-3xl font-semibold sm:text-4xl md:text-5xl"
                >
                  Pricing designed for speed, clarity, and financial control
                </h2>
                <p className="text-pretty text-muted-foreground md:text-lg">
                  Start lean, upgrade as your planning workflow grows, and keep
                  one coherent money system across devices.
                </p>
              </div>

              <div
                aria-label="Billing cycle switch"
                className="mx-auto flex w-fit items-center gap-3 rounded-full border border-border/70 bg-background/72 px-3 py-2"
              >
                <BillingLabel active={!isAnnual} className="justify-end">
                  Monthly
                </BillingLabel>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  aria-label="Toggle annual billing"
                />
                <BillingLabel active={isAnnual}>
                  Annual
                  <Badge
                    className={cn(
                      isAnnual ? "" : "bg-muted",
                      "transition-colors duration-150 ease-out"
                    )}
                  >
                    Save 15%
                  </Badge>
                </BillingLabel>
              </div>

              <div className="grid items-stretch gap-4 md:grid-cols-2">
                <BillingCard isAnnual={isAnnual} />
                <EnterpriseCard />
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                {valueTiles.map((tile) => (
                  <article
                    key={tile.title}
                    className="group landing-glass-panel rounded-xl border border-border/65 bg-background/75 p-3.5 transition-colors duration-150 hover:border-primary/35"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex size-7 items-center justify-center rounded-lg border border-border/65 bg-background/80">
                        {tile.icon}
                      </span>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        {tile.meta}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      {tile.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tile.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Not sure which plan fits best? Compare features side by side
                  and choose the one matching your workflow.
                </p>

                <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-10 w-full rounded-full border-border/75 bg-background/85 px-4 sm:w-auto"
                      >
                        Compare plans
                      </Button>
                    }
                  />

                  <DialogContent className="w-[min(34rem,calc(100vw-1.5rem))] rounded-2xl border border-border/75 bg-background/96 p-4 sm:p-5">
                    <DialogHeader className="space-y-2">
                      <DialogTitle className="font-[family-name:var(--font-syne)] text-xl">
                        Choose your best plan
                      </DialogTitle>
                      <DialogDescription>
                        Select the option that matches your current financial
                        operating rhythm.
                      </DialogDescription>
                    </DialogHeader>

                    <RadioGroup
                      value={selectedPlan}
                      onValueChange={(value) =>
                        setSelectedPlan(value as PlanId)
                      }
                      className="mt-1 gap-2.5"
                    >
                      {planOptions.map((plan) => {
                        const active = selectedPlan === plan.id;
                        const displayedPrice =
                          plan.id === "enterprise"
                            ? plan.monthly
                            : isAnnual
                              ? plan.annual
                              : plan.monthly;

                        return (
                          <label
                            key={plan.id}
                            htmlFor={`plan-${plan.id}`}
                            className={cn(
                              "relative block cursor-pointer rounded-xl border p-3.5 transition-colors duration-150",
                              active
                                ? "border-primary/45 bg-background"
                                : "border-border/70 bg-background/72 hover:border-border"
                            )}
                          >
                            <div
                              className={cn(
                                "pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br opacity-0 transition-opacity duration-150",
                                plan.accent,
                                active && "opacity-100"
                              )}
                            />
                            <div className="relative flex items-start gap-3">
                              <RadioGroupItem
                                id={`plan-${plan.id}`}
                                value={plan.id}
                                className="mt-0.5"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {plan.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {plan.description}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {displayedPrice}
                                  </p>
                                </div>

                                <ul className="mt-2 space-y-1">
                                  {plan.features.map((feature) => (
                                    <li
                                      key={feature}
                                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                                    >
                                      <Check className="mt-0.5 size-3.5 text-primary" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </RadioGroup>

                    <DialogFooter className="-mx-0 -mb-0 mt-2 border-0 bg-transparent p-0 sm:flex-row">
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-10 rounded-full"
                        onClick={() => setIsSelectorOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        size="lg"
                        className="h-10 rounded-full"
                        onClick={() => setIsSelectorOpen(false)}
                        render={
                          <Link to="/signup">
                            Continue with {selectedPlanData.name}
                          </Link>
                        }
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </m.div>
      </LazyMotion>
    </section>
  );
}
