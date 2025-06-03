import { renderHook } from "@testing-library/react";
import { type DarkMode, DarkModeContext } from "../context/dark-mode-provider";
import { useDarkMode } from "./use-dark-mode";

describe("useDarkMode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return context value when used within DarkModeProvider", () => {
    const mockDarkModeValue = {
      theme: "light" as DarkMode,
      setTheme: jest.fn(),
      toggleDarkMode: jest.fn(),
      isDark: false,
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DarkModeContext.Provider value={mockDarkModeValue}>
        {children}
      </DarkModeContext.Provider>
    );

    const { result } = renderHook(() => useDarkMode(), { wrapper });

    expect(result.current).toBe(mockDarkModeValue);
  });
});
