import { fireEvent, render, screen } from "@testing-library/react";

import { DEFAULT_THEMES, SCALED_THEMES } from "../constants/themes";
import { useThemeConfig } from "../hooks/use-theme-config";
import { ThemeSelector } from "./theme-selector";

// Mock the useThemeConfig hook
jest.mock("../hooks/use-theme-config", () => ({
  useThemeConfig: jest.fn(),
}));

describe("ThemeSelector", () => {
  const mockSetActiveTheme = jest.fn();

  beforeEach(() => {
    (useThemeConfig as jest.Mock).mockReturnValue({
      activeTheme: "zinc",
      setActiveTheme: mockSetActiveTheme,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with theme selector label", () => {
    render(<ThemeSelector />);

    expect(screen.getByText(/Select a theme:/i)).toBeInTheDocument();
  });

  it("displays all theme options", () => {
    render(<ThemeSelector />);

    // Open the select dropdown
    fireEvent.click(screen.getByRole("combobox"));

    // Check if all default themes are present
    for (const theme of DEFAULT_THEMES) {
      expect(screen.getByText(theme.name)).toBeInTheDocument();
    }

    // Check if all scaled themes are present
    for (const theme of SCALED_THEMES) {
      expect(screen.getByText(theme.name)).toBeInTheDocument();
    }
  });

  it("calls setActiveTheme when a new theme is selected", () => {
    render(<ThemeSelector />);

    // Open the select dropdown
    fireEvent.click(screen.getByRole("combobox"));

    // Select a new theme
    const newTheme = DEFAULT_THEMES[1];
    fireEvent.click(screen.getByText(newTheme.name));

    expect(mockSetActiveTheme).toHaveBeenCalledWith(newTheme.value);
  });

  it("shows mobile view on small screens", () => {
    // Mock window.matchMedia for small screen
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(max-width: 640px)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ThemeSelector />);

    // In mobile view, we should see the mobile label
    expect(
      screen.getByText("Theme", {
        selector: ".text-muted-foreground.block.sm\\:hidden",
      })
    ).toBeInTheDocument();

    // The desktop label should be hidden
    const desktopLabel = screen.getByText(/Select a theme:/i);
    expect(desktopLabel).toHaveClass("hidden");
  });
});
