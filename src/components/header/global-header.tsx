import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { ThemeSelector } from "../settings/theme-selector";
import ToggleDarkMode from "../settings/toggle-dark-mode";
import { Button } from "../ui/button";

const themeSelectorHiddenRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const GlobalHeader = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isThemeSelectorHidden = !themeSelectorHiddenRoutes.includes(
    location.pathname
  );

  console.log(location.pathname, isThemeSelectorHidden);

  return (
    <header className="flex justify-between items-center">
      <div>
        {!isHome && (
          <Button variant="link" asChild>
            <Link to="/">
              <ArrowLeft />
              Go to home
            </Link>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isThemeSelectorHidden ? <ThemeSelector /> : null}
        <ToggleDarkMode />
      </div>
    </header>
  );
};

export default GlobalHeader;
