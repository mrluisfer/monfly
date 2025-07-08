import { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";

import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

type SidebarItemProps = {
  title: string;
  url?: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
};

export const SidebarItem = ({
  title,
  url,
  children,
  disabled,
  onClick,
}: SidebarItemProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton
        tooltip={title}
        asChild
        isActive={currentPath === url}
        disabled={disabled}
        className="capitalize"
        title={disabled ? "Coming soon" : title}
      >
        {url ? (
          <Link to={url} href={url}>
            {children}
          </Link>
        ) : (
          <button onClick={onClick} disabled={disabled}>
            {children}
          </button>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
