import FontDisplaySelect from "~/components/settings/FontDisplaySelect";
import { ThemeSelector } from "~/components/settings/ThemeSelector";
import ToggleDarkMode from "~/components/settings/ToggleDarkMode";

export const QuickActions = () => (
  <section
    aria-label="Quick Actions"
    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
  >
    <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.14em]">
      Visual Controls
    </h3>
    <div className="flex flex-wrap items-center gap-3">
      <ThemeSelector />
      <FontDisplaySelect />
      <ToggleDarkMode />
    </div>
  </section>
);
