import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FolderIcon, FolderOpenIcon, HandshakeIcon } from "lucide-react";

import { TabsCategories } from "./categories";

export enum ManagementTab {
  CATEGORIES = "categories",
  PARTNERS = "partners",
}

interface ManagementTabsProps {
  /** Default tab to show when component mounts (uncontrolled mode) */
  defaultTab?: ManagementTab;
  /** Currently active tab (controlled mode) */
  activeTab?: string;
  /** Callback when tab changes. Required for controlled mode */
  onTabChange?: (tab: string) => void;
  /** Optional className for the tabs container */
  className?: string;
}

/** Helper function to check if a specific tab is active */
export const isTabActive = (
  currentTab: string,
  targetTab: ManagementTab
): boolean => {
  return currentTab === targetTab;
};

/** Get all available tabs */
export const getAvailableTabs = () => Object.values(ManagementTab);

/** Hook to manage tab state externally */
export const useManagementTabs = (
  initialTab: ManagementTab = ManagementTab.CATEGORIES
) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const switchToTab = (tab: ManagementTab) => {
    setActiveTab(tab);
  };

  const isActive = (tab: ManagementTab) => isTabActive(activeTab, tab);

  return {
    activeTab,
    setActiveTab,
    switchToTab,
    isActive,
  };
};

/**
 * ManagementTabs Component
 *
 * A flexible tabs component that can be used in both controlled and uncontrolled modes.
 *
 * @example
 * // Uncontrolled mode (manages its own state)
 * <ManagementTabs />
 *
 * @example
 * // Controlled mode (parent manages state)
 * const [activeTab, setActiveTab] = useState(ManagementTab.CATEGORIES);
 * <ManagementTabs
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 *
 * @example
 * // Using the custom hook
 * const { activeTab, switchToTab, isActive } = useManagementTabs();
 * <ManagementTabs
 *   activeTab={activeTab}
 *   onTabChange={switchToTab}
 * />
 */
export const ManagementTabs = ({
  defaultTab = ManagementTab.CATEGORIES,
  activeTab,
  onTabChange,
  className,
}: ManagementTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] =
    useState<string>(defaultTab);

  // Use controlled or uncontrolled state
  const currentTab = activeTab !== undefined ? activeTab : internalActiveTab;

  const handleTabChange = (tab: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(tab);
    }
    onTabChange?.(tab);
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList>
        <TabsTrigger
          value={ManagementTab.CATEGORIES}
          className="capitalize gap-2"
        >
          {isTabActive(currentTab, ManagementTab.CATEGORIES) ? (
            <FolderOpenIcon className="text-primary transition-colors duration-200" />
          ) : (
            <FolderIcon className="text-muted-foreground transition-colors duration-200" />
          )}
          {ManagementTab.CATEGORIES}
        </TabsTrigger>
        <TabsTrigger
          value={ManagementTab.PARTNERS}
          className="capitalize gap-2"
        >
          <HandshakeIcon
            className={
              isTabActive(currentTab, ManagementTab.PARTNERS)
                ? "text-orange-500 dark:text-orange-300 transition-colors duration-200"
                : "text-muted-foreground transition-colors duration-200"
            }
          />
          {ManagementTab.PARTNERS}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={ManagementTab.CATEGORIES}>
        <TabsCategories />
      </TabsContent>
      <TabsContent value={ManagementTab.PARTNERS}>
        Change your password here.
      </TabsContent>
    </Tabs>
  );
};
