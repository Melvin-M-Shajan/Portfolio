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
