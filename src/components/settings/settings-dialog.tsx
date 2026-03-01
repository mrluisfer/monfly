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

export const SettingsDialog = ({
  children,
}: {
  children?: React.ReactElement;
}) => {
  const trigger = children ?? (
    <Button variant="default" size={"lg"}>
      <Settings />
      <span className="hidden md:block">Settings</span>
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
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
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <p>{label}</p>
      {children}
    </div>
  );
};
