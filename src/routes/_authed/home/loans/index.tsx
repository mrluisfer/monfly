import { createFileRoute } from "@tanstack/react-router";
import { HandCoinsIcon } from "lucide-react";
import { AddLoanCard } from "~/components/loans/AddLoanCard";
import { LoansList } from "~/components/loans/LoansList";

import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/_authed/home/loans/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <PageHeader
        title="Loans"
        description="Track who owes you money — friends, refunds (SAT, insurance), or any expected income. Mark partial or full payments."
        icon={<HandCoinsIcon className="size-5" aria-hidden="true" />}
      />

      <AddLoanCard />
      <LoansList />
    </div>
  );
}
