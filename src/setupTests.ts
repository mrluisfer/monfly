import "@testing-library/jest-dom";

// Mock TanStack Query
jest.mock("@tanstack/react-query", () => ({
	useQuery: jest.fn(() => ({ data: undefined, isLoading: false, error: null })),
	useMutation: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
	useQueryClient: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Suppress React 18 console warnings
const originalError = console.error;
beforeAll(() => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	console.error = (...args: any[]) => {
		if (/Warning.*not wrapped in act/.test(args[0])) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});
