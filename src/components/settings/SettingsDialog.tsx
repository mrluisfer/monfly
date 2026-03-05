import type { ReactElement, ReactNode } from "react";
import { Settings } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FontDisplaySelect from "./FontDisplaySelect";
import { SonnerPositionSelector } from "./SonnerPositionSelector";
import { ThemeSelector } from "./ThemeSelector";

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
    <Button variant="default" size={"lg"}>
      <Settings />
      <span className="hidden md:block">Settings</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Change the settings of your app</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <SettingsItem label="Notification Position:">
            <SonnerPositionSelector />
          </SettingsItem>
          <SettingsItem label="Theme:">
            <ThemeSelector />
          </SettingsItem>
          <SettingsItem label="Font Display:">
            <FontDisplaySelect />
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
