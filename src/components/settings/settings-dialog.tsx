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
import FontDisplaySelect from "./font-display-select";
import { SonnerPositionSelector } from "./sonner-position-selector";
import { ThemeSelector } from "./theme-selector";
import ToggleDarkMode from "./toggle-dark-mode";

export const SettingsDialog = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" className="rounded-full">
            <Settings className="text-primary" />
            <span className="hidden md:block">Settings</span>
          </Button>
        )}
      </DialogTrigger>
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
          <SettingsItem label="Dark Mode:">
            <ToggleDarkMode />
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
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <p>{label}</p>
      {children}
    </div>
  );
};
