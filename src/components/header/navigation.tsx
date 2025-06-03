import { Link } from "@tanstack/react-router";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { Button } from "../ui/button";

const Navigation = () => {
  return (
    <div className="flex items-center gap-4">
      {sidebarRoutes.map((route) => (
        <Button variant="outline" key={route.title} asChild>
          <Link className="font-bold" to={route.url}>
            {route.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};
// accessibilityLayer;

export default Navigation;
