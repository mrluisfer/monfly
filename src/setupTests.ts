import "@testing-library/jest-dom";
import { afterAll, beforeAll, vi } from "vitest";

// Mock TanStack Query
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({ isLoading: false, mutate: vi.fn() })),
  useQuery: vi.fn(() => ({ data: undefined, error: null, isLoading: false })),
  useQueryClient: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

// Suppress React 18 console warnings
const ACT_WARNING = /Warning.*not wrapped in act/;
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (ACT_WARNING.test(String(args[0]))) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
