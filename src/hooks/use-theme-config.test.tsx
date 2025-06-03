import { renderHook } from "@testing-library/react";
import { ThemeContext } from "../context/theme-provider";
import { useThemeConfig } from "./use-theme-config";

describe("useThemeConfig", () => {
  const mockThemeValue = {
    activeTheme: "dark",
    setActiveTheme: jest.fn(),
    isDark: true,
  };

  it("should return context value when used within ActiveThemeProvider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useThemeConfig(), { wrapper });

    expect(result.current).toBe(mockThemeValue);
  });

  it("should throw error when used outside ActiveThemeProvider", () => {
    expect(() => renderHook(() => useThemeConfig())).toThrow(
      "useThemeConfig must be used within an ActiveThemeProvider",
    );
  });

  it("should call setActiveTheme with new theme", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockThemeValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useThemeConfig(), { wrapper });
    result.current.setActiveTheme("light");
    expect(mockThemeValue.setActiveTheme).toHaveBeenCalledWith("light");
  });
});
