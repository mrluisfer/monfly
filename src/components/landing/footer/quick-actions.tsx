import FontDisplaySelect from "~/components/settings/font-display-select";
import { ThemeSelector } from "~/components/settings/theme-selector";
import ToggleDarkMode from "~/components/settings/toggle-dark-mode";

export const QuickActions = () => {
  return (
    <section
      aria-label="Quick Actions"
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <h3 className="font-semibold">Quick Actions</h3>
      <div className="flex items-center gap-4 flex-wrap">
        <ThemeSelector />
        <FontDisplaySelect />
        <ToggleDarkMode />
      </div>
    </section>
  );
};
