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
  await expect(page.getByRole("link", { name: /view on npm/i })).toHaveAttribute("href", "https://www.npmjs.com/package/melcp");
});

test("unknown routes use the custom 404", async ({ page }) => {
  const response = await page.goto("/not-a-real-route/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /this agent reached a node that does not exist/i })).toBeVisible();
});

for (const width of [320, 375, 566, 768, 982, 1440]) {
  test(`every route stays within the viewport at ${width}px`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} overflowed at ${width}px`).toBeLessThanOrEqual(1);
    }
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
  await page.setViewportSize({ width: 982, height: 698 });
  await page.goto("/");
  const heroLayers = await page.evaluate(() => ({
    portrait: Number.parseInt(getComputedStyle(document.querySelector(".portrait-frame")!).zIndex, 10),
    graph: Number.parseInt(getComputedStyle(document.querySelector(".hero-graph")!).zIndex, 10),
    supervisorLabels: document.querySelectorAll(".hero-graph text").length,
    portraitCenter: (() => { const box = document.querySelector(".portrait-frame")!.getBoundingClientRect(); return box.left + box.width / 2; })(),
    graphCenter: (() => { const box = document.querySelector(".hero-graph")!.getBoundingClientRect(); return box.left + box.width / 2; })(),
  }));
  expect(heroLayers.portrait).toBeGreaterThan(heroLayers.graph);
  expect(heroLayers.supervisorLabels).toBe(0);
  expect(heroLayers.graphCenter).toBeLessThan(heroLayers.portraitCenter);
  await expect(page.locator(".horizontal-accordion .accordion-media img")).toHaveCount(4);
});

test("navigation omits the brand mark and the large footer is home-only", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await expect(page.locator(".brand-mark")).toHaveCount(0);
  await expect(page.locator(".site-footer")).toHaveCount(1);
  for (const route of routes.slice(1)) {
    await page.goto(route);
    await expect(page.locator(".site-footer")).toHaveCount(0);
  }
});

test("Mini Mel opens, stays in the viewport, and answers a portfolio question", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route("**/api/ask-melvin", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 850));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "Melvin builds production multi-agent systems and Graph-RAG platforms.",
      }),
    });
  });
  await page.goto("/");

  const pet = page.getByRole("button", { name: "Ask Mini Mel about Melvin" });
  await expect(pet).toBeVisible();
  await pet.click({ force: true });
  await expect(page.locator(".portfolio-pet")).toHaveAttribute("data-motion", "wave");

  const dialog = page.getByRole("dialog", { name: "Ask Mini Mel about Melvin" });
  await expect(dialog).toBeVisible();
  const panel = await dialog.boundingBox();
  expect(panel).not.toBeNull();
  expect(panel!.x).toBeGreaterThanOrEqual(0);
  expect(panel!.x + panel!.width).toBeLessThanOrEqual(375);

  await page.getByLabel("Ask a question about Melvin").fill("What does Melvin build?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".portfolio-pet")).toHaveAttribute("data-motion", "think");
  await expect(page.getByText(/production multi-agent systems and Graph-RAG/i)).toBeVisible();
  await expect(page.locator(".portfolio-pet")).toHaveAttribute("data-motion", "answer");
});

test("requested profile content is current", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator(".about-image img")).toHaveAttribute("src", /melvin-at-work/);
  await expect(page.getByText(/Software Developer, NCompass Techstudio, April 2025 to August 2026/)).toBeVisible();

  await page.goto("/projects/");
  await expect(page.getByText("Swark", { exact: true })).toBeVisible();

  await page.goto("/projects/multi-agent-control-platform/");
  await expect(page.getByText(/runtime Row Level Security context switching/)).toBeVisible();
  await expect(page.getByRole("link", { name: /GitHub repository/i }))
    .toHaveAttribute("href", "https://github.com/Melvin-M-Shajan/multi-agent-control-platform");

  await page.goto("/skills/");
  await expect(page.locator(".skill-groups").getByText("Amazon Bedrock", { exact: true })).toBeVisible();
  await expect(page.locator(".skill-groups").getByText("n8n", { exact: true })).toBeVisible();
  await expect(page.locator(".skill-groups").getByText("Prompt Engineering", { exact: true })).toBeVisible();

  await page.goto("/contact/");
  await expect(page.getByRole("link", { name: /linkedin professional profile/i }))
    .toHaveAttribute("href", "https://www.linkedin.com/in/melvin-shajan");
});

test("about and project pages use distinct generated imagery without scrolling diagrams", async ({ page }) => {
  await page.setViewportSize({ width: 638, height: 900 });
  await page.goto("/about/");
  await expect(page.locator(".exploring-card img")).toHaveCount(3);

  await page.goto("/projects/");
  await expect(page.locator(".project-row-media img")).toHaveCount(2);
  await expect(page.locator(".horizontal-accordion .accordion-media img")).toHaveCount(5);

  for (const slug of ["graphrag-enterprise", "multi-agent-control-platform"]) {
    await page.goto(`/projects/${slug}/`);
    await expect(page.locator(".architecture-media img")).toBeVisible();
    await expect(page.locator(".architecture-node-list li")).toHaveCount(6);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});
