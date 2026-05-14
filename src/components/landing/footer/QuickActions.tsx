import FontDisplaySelect from "~/components/settings/FontDisplaySelect";
import { ThemeSelector } from "~/components/settings/ThemeSelector";
import ToggleDarkMode from "~/components/settings/ToggleDarkMode";

export const QuickActions = () => {
  return (
    <section
      aria-label="Quick Actions"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.14em] uppercase">
        Visual Controls
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeSelector />
        <FontDisplaySelect />
        <ToggleDarkMode />
      </div>
    </section>
  );
};
