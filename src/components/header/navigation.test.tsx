import { render, screen } from "@testing-library/react";
import Navigation from "./navigation";

// Mock constants
jest.mock("~/constants/sidebar-routes", () => ({
  sidebarRoutes: [
    { url: "/", title: "Home" },
    { url: "/dashboard", title: "Dashboard" },
    { url: "/reports", title: "Reports" },
  ],
}));

jest.mock("../ui/button", () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("Navigation", () => {
  it("renders a button for each sidebar route", () => {
    render(<Navigation />);
    // Check that all route titles are present as links
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("renders correct href attributes for each link", () => {
    render(<Navigation />);
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByText("Reports").closest("a")).toHaveAttribute(
      "href",
      "/reports",
    );
  });

  it("has accessible roles and text", () => {
    render(<Navigation />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(3);
    expect(links[0]).toHaveTextContent("Home");
    expect(links[1]).toHaveTextContent("Dashboard");
    expect(links[2]).toHaveTextContent("Reports");
  });
});
