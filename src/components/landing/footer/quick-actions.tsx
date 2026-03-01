import FontDisplaySelect from "~/components/settings/font-display-select";
import { ThemeSelector } from "~/components/settings/theme-selector";
import ToggleDarkMode from "~/components/settings/toggle-dark-mode";

export const QuickActions = () => {
  return (
    <section
      aria-label="Quick Actions"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Quick Actions
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeSelector />
        <FontDisplaySelect />
        <ToggleDarkMode />
      </div>
    </section>
  );
};
