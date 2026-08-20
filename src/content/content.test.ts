import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { posts } from "@/content/posts";
import { projects } from "@/content/projects";
import { petAssistant } from "@/content/assistant";
import { siteConfig, skills, workHighlights } from "@/content/site";

describe("portfolio configuration", () => {
  it("keeps unverified outcomes explicit and links honest", () => {
    expect(projects).toHaveLength(2);
    expect(projects.flatMap((project) => project.outcomes).every((outcome) => outcome.value === null)).toBe(true);
    expect(projects[0].links).toEqual({ github: null, demo: null, package: null });
    expect(projects[1].links.github).toBe("https://github.com/Melvin-M-Shajan/multi-agent-control-platform");
    expect(projects[1].links.package).toBe("https://www.npmjs.com/package/melcp");
  });

  it("keeps private contact details out of public configuration", () => {
    expect(JSON.stringify(siteConfig)).not.toMatch(/\+91|Chennai/i);
    expect(siteConfig.resumeUrl).toBe("/melvin-m-shajan-resume.pdf");
    expect(siteConfig.url).toMatch(/^https:\/\/.+\.vercel\.app$/);
  });

  it("maps every draft post to an MDX outline", () => {
    expect(posts.every((post) => post.draft)).toBe(true);
    for (const post of posts) {
      const source = readFileSync(`src/content/blog/${post.slug}.mdx`, "utf8");
      expect(source).toMatch(/^## /m);
      expect(post.title.length).toBeGreaterThan(12);
    }
  });

  it("preserves the exact dense bento allocation", () => {
    const css = readFileSync("src/app/globals.css", "utf8").replace(/\s+/g, " ");
    expect(css).toContain(".bento-a { grid-area: 1 / 1 / 2 / 5; }");
    expect(css).toContain(".bento-b { grid-area: 2 / 1 / 3 / 5; }");
    expect(css).toContain(".bento-c { grid-area: 1 / 5 / 3 / 8; }");
    expect(css).toContain(".bento-d { grid-area: 1 / 8 / 2 / 13; }");
    expect(css).toContain(".bento-e { grid-area: 2 / 8 / 3 / 13; }");
  });

  it("provides a real image and useful alt text for each work highlight", () => {
    for (const item of workHighlights) {
      expect(item.alt.length).toBeGreaterThan(24);
      expect(item.image).toMatch(/^\/images\/projects\/.+\.webp$/);
    }
  });

  it("keeps current professional links, work names, and AWS skills in configuration", () => {
    expect(siteConfig.social.find((item) => item.label === "LinkedIn")?.href)
      .toBe("https://www.linkedin.com/in/melvin-shajan");
    expect(workHighlights.some((item) => item.title === "Swark")).toBe(true);
    expect(skills.Cloud).toEqual(expect.arrayContaining(["AWS", "Amazon EC2", "Amazon S3", "AWS Lambda"]));
    expect(skills.Automation).toEqual(expect.arrayContaining(["n8n", "Apache NiFi", "ETL Pipelines"]));
    expect(skills["AI systems"]).toContain("Prompt Engineering");
    expect(petAssistant.profile.experience).toContain("April 2025 to August 2026");
  });

  it("keeps the control platform details aligned with the verified resume", () => {
    const controlPlatform = projects.find((project) => project.slug === "multi-agent-control-platform");

    expect(controlPlatform?.approach.join(" ")).toMatch(/Row Level Security/);
    expect(controlPlatform?.approach.join(" ")).toMatch(/Gemini and Groq fallback chains/);
    expect(controlPlatform?.technologies).toEqual(
      expect.arrayContaining(["ReactFlow", "Recharts", "Mermaid.js"]),
    );
  });

  it("provides distinct imagery for research cards and case studies", () => {
    expect(new Set(siteConfig.currentExploring.map((item) => item.image)).size).toBe(3);
    expect(siteConfig.currentExploring.every((item) => item.alt.length > 24)).toBe(true);
    for (const project of projects) {
      expect(project.featureImage).toMatch(/^\/images\/projects\/.+-feature\.webp$/);
      expect(project.architecture.image).toMatch(/^\/images\/projects\/.+-architecture\.webp$/);
    }
    expect(siteConfig.publishedPackage.href).toBe("https://www.npmjs.com/package/melcp");
  });
});
