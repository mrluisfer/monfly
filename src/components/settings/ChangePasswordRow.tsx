import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, KeyRoundIcon } from "lucide-react";

import { CHANGE_PASSWORD_PATH } from "~/components/shell/sidebar/sidebar-constants";

/**
 * A settings/profile row that links out to the dedicated change-password view
 * instead of embedding the form. Shaped as an `<li>` so it drops into either
 * page's `<ul>` section and stays visually consistent with the rows around it.
 */
export function ChangePasswordRow() {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-0.5 pr-4">
        <p className="text-foreground flex items-center gap-1.5 text-sm font-medium">
          <KeyRoundIcon
            className="text-muted-foreground size-3.5"
            aria-hidden="true"
          />
          Change password
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Verify your current password and set a new, stronger one.
        </p>
      </div>
      <Link
        to={CHANGE_PASSWORD_PATH}
        className="group bg-foreground/5 text-foreground hover:bg-foreground/10 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
      >
        Update password
        <ArrowUpRightIcon
          className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
