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

	// it("should throw error when used outside DarkModeProvider", () => {
	// 	const { result } = renderHook(() => useDarkMode());
	// 	expect(result.current).toEqual(
	// 		new Error("useDarkMode must be used within an DarkModeProvider"),
	// 	);
	// });
});
