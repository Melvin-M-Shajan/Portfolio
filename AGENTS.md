# Repository Guidelines

## Project structure and module organization

This is a statically exported Next.js App Router portfolio. Route modules live in `src/app/`; reusable UI and animation code is in `src/components/`; typed portfolio data and MDX drafts are under `src/content/`. Place downloadable or generated assets in `public/`, E2E checks in `tests/e2e/`, and repository-local agent skills in `.codex/skills/`. Keep content changes in the typed configuration instead of duplicating copy inside components.

## Build, test, and development commands

- `pnpm install` — install the locked dependency graph.
- `pnpm dev` — start the local Next.js development server.
- `pnpm lint` — run the Next.js ESLint rules.
- `pnpm test` — run Vitest and Testing Library checks.
- `pnpm test:e2e` — build first, then exercise the static export with Playwright.
- `pnpm build` — regenerate social artwork and export the site to `out/`.
- `pnpm start` — serve `out/` locally.
- `pnpm lighthouse` — audit the exported home, projects, and contact pages.

## Coding style and naming conventions

Use TypeScript, two-space indentation, semicolons, and double quotes. Components use PascalCase; route folders, slugs, and asset names use lowercase kebab-case. Prefer Server Components unless browser state or animation requires `"use client"`. Keep Motion imports on `motion/react`; reserve GSAP for scroll pinning, scrubbing, and the agent graph. Honor the reduced-motion CSS and avoid introducing horizontal overflow.

## Testing guidelines

Name unit tests `*.test.ts(x)` beside the code they cover. Playwright specs belong in `tests/e2e/`. Test public behavior: null project metrics and links, contact validation, theme persistence, MDX metadata, keyboard access, responsive overflow, and reduced motion. Run lint, unit tests, E2E tests, and a production build before opening a pull request.

## Commit and pull request guidelines

Use focused, imperative Conventional Commit subjects such as `feat: add project case study` or `fix: preserve theme on reload`. Pull requests should explain purpose and approach, list verification, link issues, and include desktop/mobile screenshots for visual changes. Call out dependencies, configuration changes, and intentionally unavailable links or metrics.

## Agent-specific instructions

Perform safe, in-scope implementation and verification directly, including starting local apps. Never invent portfolio metrics, links, or credentials; use explicit unavailable states.
