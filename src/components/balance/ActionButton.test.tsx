import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { TooltipProvider } from "../ui/tooltip";
import { ActionButton } from "./ActionButton";

// Regression: an `id` on the element passed to TooltipTrigger's `render` prop
// overrides the id Base UI registers the trigger under, so hover never opens
// the popup. This fails if that ever comes back.
test("shows its description on hover", async () => {
  render(
    <TooltipProvider>
      <ActionButton icon={null} label="Reports" description="Spending trends" />
    </TooltipProvider>,
  );

  await userEvent.hover(screen.getByRole("button", { name: "Reports" }));

  expect(await screen.findByText("Spending trends")).toBeInTheDocument();
});

// Regression: ActionButton is used as another popup's trigger
// (AddTransactionButton passes it as DialogTrigger's `render`), so it has to
// forward the props Base UI injects instead of swallowing them.
test("works as a DialogTrigger render target", async () => {
  render(
    <TooltipProvider>
      <Dialog>
        <DialogTrigger
          render={<ActionButton icon={null} label="Add transaction" />}
        />
        <DialogContent>dialog body</DialogContent>
      </Dialog>
    </TooltipProvider>,
  );

  const trigger = screen.getByRole("button", { name: "Add transaction" });
  expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  expect(trigger).toHaveAttribute("aria-expanded", "false");

  await userEvent.click(trigger);

  expect(screen.getByText("dialog body")).toBeInTheDocument();
  expect(trigger).toHaveAttribute("aria-expanded", "true");
});
