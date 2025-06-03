import { render, screen } from "@testing-library/react";
import GlobalHeader from "./global-header";

// Mock sub components
jest.mock("../theme-selector", () => ({
  ThemeSelector: () => <div data-testid="theme-selector" />,
}));
jest.mock("../toggle-dark-mode", () => ({
  __esModule: true,
  default: () => <div data-testid="toggle-dark-mode" />,
}));

// Mock useLocation
jest.mock("@tanstack/react-router", () => {
  const actual = jest.requireActual("@tanstack/react-router");
  return {
    ...actual,
    useLocation: jest.fn(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const { useLocation } = jest.requireMock("@tanstack/react-router");

describe("GlobalHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders ThemeSelector and ToggleDarkMode", () => {
    useLocation.mockReturnValue({ pathname: "/" });
    render(<GlobalHeader />);
    expect(screen.getByTestId("theme-selector")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-dark-mode")).toBeInTheDocument();
  });

  it("does not render 'Go to home' link on home page", () => {
    useLocation.mockReturnValue({ pathname: "/" });
    render(<GlobalHeader />);
    expect(screen.queryByText(/Go to home/i)).not.toBeInTheDocument();
  });

  it("renders 'Go to home' link when not on home page", () => {
    useLocation.mockReturnValue({ pathname: "/dashboard" });
    render(<GlobalHeader />);
    expect(screen.getByText(/Go to home/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go to home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
