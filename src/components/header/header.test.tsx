import { render, screen } from "@testing-library/react";

import { Header } from ".";

// Mocks
jest.mock("@tanstack/react-router", () => {
  const actual = jest.requireActual("@tanstack/react-router");
  return {
    ...actual,
    useLocation: jest.fn(),
  };
});
const { useLocation } = jest.requireMock("@tanstack/react-router");

// Mock constants
jest.mock("~/constants/sidebar-routes", () => ({
  sidebarRoutes: [
    { url: "/", title: "Home" },
    { url: "/dashboard", title: "Dashboard" },
  ],
}));

// Mock sub components
jest.mock("../ui/sidebar", () => ({
  SidebarTrigger: () => <div data-testid="sidebar-trigger" />,
}));
jest.mock("../settings-dialog", () => ({
  SettingsDialog: () => <div data-testid="settings-dialog" />,
}));
jest.mock("../theme-selector", () => ({
  ThemeSelector: () => <div data-testid="theme-selector" />,
}));
jest.mock("../toggle-dark-mode", () => ({
  __esModule: true,
  default: () => <div data-testid="toggle-dark-mode" />,
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all header sub components", () => {
    useLocation.mockReturnValue({ pathname: "/" });
    render(<Header />);
    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("settings-dialog")).toBeInTheDocument();
  });

  it("renders the correct title for current route", () => {
    useLocation.mockReturnValue({ pathname: "/dashboard" });
    render(<Header />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
