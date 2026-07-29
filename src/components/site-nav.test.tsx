import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteNav } from "@/components/site-nav";

const setTheme = vi.fn();

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "dark", setTheme }) }));
vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    header: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  useMotionValueEvent: vi.fn(),
  useScroll: () => ({ scrollY: { getPrevious: () => 0 } }),
}));

describe("theme and navigation controls", () => {
  beforeEach(() => setTheme.mockClear());

  it("exposes a named theme button and toggles the theme", () => {
    render(<SiteNav />);
    const button = screen.getByRole("button", { name: "Switch to light theme" });
    fireEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("opens a keyboard-accessible mobile menu", () => {
    render(<SiteNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getAllByRole("link", { name: "Projects" })).toHaveLength(2);
  });
});
