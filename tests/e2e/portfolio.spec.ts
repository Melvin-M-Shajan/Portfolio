import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about/",
  "/projects/",
  "/projects/graphrag-enterprise/",
  "/projects/multi-agent-control-platform/",
  "/skills/",
  "/blog/",
  "/blog/graph-rag-multi-hop-reasoning/",
  "/blog/guardrails-agent-generated-sql/",
  "/contact/",
  "/resume/",
];

for (const route of routes) {
  test(`${route} renders without route errors`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Application error");
  });
}

test("mobile navigation, theme persistence, and keyboard access", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator(".mobile-nav").getByRole("link", { name: "Projects" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("resume offers inline viewing, download, and fallback", async ({ page }) => {
  await page.goto("/resume/");
  await expect(page.locator('iframe[title*="resume"]')).toHaveAttribute("src", "/melvin-m-shajan-resume.pdf");
  await expect(page.getByRole("link", { name: /download pdf/i })).toHaveAttribute("download", "");
  await expect(page.getByRole("link", { name: /open the pdf directly/i })).toHaveAttribute("href", "/melvin-m-shajan-resume.pdf");
});

test("unknown routes use the custom 404", async ({ page }) => {
  const response = await page.goto("/not-a-real-route/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /this agent reached a node that does not exist/i })).toBeVisible();
});

for (const width of [375, 768, 1440]) {
  test(`layout has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("hero headline stays within three lines on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const lines = await page.locator(".hero h1").evaluate((element) => {
    const style = getComputedStyle(element);
    return Math.round(element.getBoundingClientRect().height / Number.parseFloat(style.lineHeight));
  });
  expect(lines).toBeLessThanOrEqual(3);
  await expect(page.locator(".project-bento > *")).toHaveCount(5);
});

test("portrait is unobstructed and work accordion uses generated imagery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const heroLayers = await page.evaluate(() => ({
    portrait: Number.parseInt(getComputedStyle(document.querySelector(".portrait-frame")!).zIndex, 10),
    graph: Number.parseInt(getComputedStyle(document.querySelector(".hero-graph")!).zIndex, 10),
    supervisorLabels: document.querySelectorAll(".hero-graph text").length,
  }));
  expect(heroLayers.portrait).toBeGreaterThan(heroLayers.graph);
  expect(heroLayers.supervisorLabels).toBe(0);
  await expect(page.locator(".horizontal-accordion .accordion-media img")).toHaveCount(4);
});
