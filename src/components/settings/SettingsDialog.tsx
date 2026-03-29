import type { ReactElement, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SonnerPositionSelector } from "./SonnerPositionSelector";

type SettingsDialogProps = {
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
};

export const SettingsDialog = ({
  children,
  open,
  onOpenChange,
  showTrigger = true,
}: SettingsDialogProps) => {
  const trigger = children ?? (
    <Button variant="outline" size={"lg"}>
      <Settings />
      <span className="hidden md:block">Settings</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-primary"}>Settings</DialogTitle>
          <DialogDescription>Change the settings of your app</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <SettingsItem label="Notification Position:">
            <SonnerPositionSelector />
          </SettingsItem>
          <SettingsItem label="Theme:">
            <Button
              render={
                <DialogClose
                  onClick={() => onOpenChange?.(false)}
                  render={<Link to="/user/theme">Change Theme</Link>}
                />
              }
            />
          </SettingsItem>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SettingsItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <p>{label}</p>
      {children}
    </div>
  );
};
