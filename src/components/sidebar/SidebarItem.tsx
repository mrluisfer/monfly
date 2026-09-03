import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

interface SidebarItemProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  title: string;
  url?: string;
}

export const SidebarItem = ({
  title,
  url,
  children,
  disabled,
  onClick,
}: SidebarItemProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const render = url ? (
    <Link to={url} href={url}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );

  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton
        tooltip={title}
        render={render}
        isActive={currentPath === url}
        disabled={disabled}
        className="capitalize"
        title={disabled ? "Coming soon" : title}
      />
    </SidebarMenuItem>
  );
};
