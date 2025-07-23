import FontDisplaySelect from "~/components/settings/font-display-select";
import { ThemeSelector } from "~/components/settings/theme-selector";
import ToggleDarkMode from "~/components/settings/toggle-dark-mode";

export const QuickActions = () => {
  return (
    <section
      aria-label="Quick Actions"
      className="flex justify-between items-center"
    >
      <h3 className="font-semibold mb-2">Quick Actions</h3>
      <div className="flex items-center gap-4">
        <ThemeSelector />
        <FontDisplaySelect />
        <ToggleDarkMode />
      </div>
    </section>
  );
};
