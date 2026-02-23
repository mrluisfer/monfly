# ManagementTabs Usage Examples

## Basic Usage (Uncontrolled Mode)

The simplest way to use the component where it manages its own state:

```tsx
import { ManagementTabs } from "~/components/home/management-tabs";

export function HomePage() {
  return (
    <div>
      <ManagementTabs />
    </div>
  );
}
```

## Controlled Mode

When you need to control the tab state from a parent component:

```tsx
import { useState } from "react";
import {
  ManagementTab,
  ManagementTabs,
} from "~/components/home/management-tabs";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<string>(ManagementTab.CATEGORIES);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <ManagementTabs activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
```

## Using the Custom Hook

For more complex state management:

```tsx
import {
  ManagementTab,
  ManagementTabs,
  useManagementTabs,
} from "~/components/home/management-tabs";

export function HomePage() {
  const { activeTab, switchToTab, isActive } = useManagementTabs(
    ManagementTab.CATEGORIES
  );

  const handleSomeAction = () => {
    // Programmatically switch to categories tab
    switchToTab(ManagementTab.CATEGORIES);
  };

  return (
    <div>
      <button onClick={handleSomeAction}>Go to Categories Tab</button>

      <div>
        Current tab is Categories:{" "}
        {isActive(ManagementTab.CATEGORIES) ? "Yes" : "No"}
      </div>

      <ManagementTabs activeTab={activeTab} onTabChange={switchToTab} />
    </div>
  );
}
```

## With Custom Default Tab

```tsx
import {
  ManagementTab,
  ManagementTabs,
} from "~/components/home/management-tabs";

export function HomePage() {
  return (
    <div>
      <ManagementTabs defaultTab={ManagementTab.CATEGORIES} />
    </div>
  );
}
```

## API Reference

### Props

- `defaultTab?: ManagementTab` - Default tab to show when component mounts (uncontrolled mode)
- `activeTab?: string` - Currently active tab (controlled mode)
- `onTabChange?: (tab: string) => void` - Callback when tab changes. Required for controlled mode
- `className?: string` - Optional className for the tabs container

### Helper Functions

- `isTabActive(currentTab: string, targetTab: ManagementTab): boolean` - Check if a specific tab is active
- `getAvailableTabs()` - Get all available tabs

### Custom Hook

- `useManagementTabs(initialTab?: ManagementTab)` - Returns `{ activeTab, setActiveTab, switchToTab, isActive }`

### ManagementTab Enum

```tsx
export enum ManagementTab {
  CATEGORIES = "categories",
}
```
