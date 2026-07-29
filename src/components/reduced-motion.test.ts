import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("reduced motion", () => {
  it("disables animation and scroll behavior at the CSS boundary", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reducedMotion).toContain("animation-duration: .01ms");
    expect(reducedMotion).toContain("scroll-behavior: auto");
  });
});
