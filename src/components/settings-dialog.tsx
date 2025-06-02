import { Settings } from "lucide-react";
import { SonnerPositionSelector } from "./sonner-position-selector";
import { ThemeSelector } from "./theme-selector";
import ToggleDarkMode from "./toggle-dark-mode";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export const SettingsDialog = () => {
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant="outline">
					<Settings />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Change the settings of your app</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-6">
					<SettingsItem label="Sonner Position:">
						<SonnerPositionSelector />
					</SettingsItem>
					<SettingsItem label="Theme:">
						<ThemeSelector />
					</SettingsItem>
					<SettingsItem label="Dark Mode:">
						<ToggleDarkMode />
					</SettingsItem>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const SettingsItem = ({
	label,
	children,
}: { label: string; children: React.ReactNode }) => {
	return (
		<div className="flex items-center gap-2 justify-between">
			<p>{label}</p>
			{children}
		</div>
	);
};
