import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/shared/NotFound";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NotFound />;
}
