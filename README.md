# Melvin M Shajan — AI Engineer Portfolio

A multi-page portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Motion, GSAP, and local MDX. The production build is a portable static export in `out/`.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
pnpm lighthouse
```

Set `NEXT_PUBLIC_SITE_URL` before a production build to generate canonical metadata for the final domain. Analytics remains off unless `NEXT_PUBLIC_ENABLE_ANALYTICS=true`. An optional form service can be added with `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`; without it, the contact form opens a prefilled email draft.

## Mini Mel portfolio assistant

The walking Mini Mel pet is rendered globally and opens a portfolio-grounded chat. The browser never receives the Groq credential.

- Set `GROQ_API_KEY` as a server-side environment variable in the hosting provider.
- Optionally set `PET_ALLOWED_ORIGINS` to a comma-separated list of additional trusted origins.
- Vercel uses `api/ask-melvin.ts`.
- Netlify uses `netlify/functions/ask-melvin.mts` at `/api/ask-melvin`.

Use a rotated Groq key if a previous key has ever been pasted into chat, source code, logs, or another exposed surface.
