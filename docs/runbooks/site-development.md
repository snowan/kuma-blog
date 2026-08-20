# Kuma Blog site development

This runbook covers the Astro foundation. It does not authorize publishing,
deployment, content migration, or a GitHub Pages settings change.

## Toolchain

- Node.js 24
- pnpm 10.8.1
- Astro and integrations pinned in `package.json` and `pnpm-lock.yaml`

Install the exact dependency graph:

```bash
pnpm install --frozen-lockfile
```

## Local development

Start the development server:

```bash
pnpm dev
```

Because Kuma Blog is a GitHub Pages project site, open the base-prefixed URL:

```text
http://localhost:4321/kuma-blog/
```

Do not treat a page that works only at `/` as valid.

## Required verification

Run the complete local gate:

```bash
pnpm verify
```

It performs:

1. `astro check` for TypeScript, Astro, and content-schema diagnostics.
2. A static Astro build with RSS, sitemap, canonical URLs, and `/kuma-blog/`
   base-path handling.
3. Pagefind indexing over generated reader-facing pages.
4. `tools/site/verify-dist.mjs` to check required routes, generated internal
   links, canonical URLs, RSS, sitemap, 404 metadata, draft exclusion, and the
   curated deployment boundary.

The verifier fails when legacy repository trees, draft fixtures, dependency
archives, or root-relative links escape into `dist/`.

## Preview the generated artifact

Build and preview the exact static output:

```bash
pnpm build
pnpm preview --host 127.0.0.1 --port 4322
```

Open:

```text
http://127.0.0.1:4322/kuma-blog/
```

For front-end changes, check the homepage and relevant routes at desktop and
320–360 px widths. Verify keyboard focus, visible labels, horizontal overflow,
reduced-motion behavior, and browser console errors.

## Content fixtures

The files named `foundation-fixture.md` exist only to exercise each content
schema. They use `status: draft` and must not create routes, RSS entries,
sitemap entries, search results, or published assets.

## CI

The `Site CI` workflow runs `pnpm install --frozen-lockfile` and `pnpm verify`
when the site foundation changes. The existing Python application workflow
continues independently.

## Deployment boundary

Only generated `dist/` output may eventually be uploaded to GitHub Pages. The
current legacy Pages workflow is intentionally unchanged by the foundation PR.
Replacing it with Astro's official build-and-deploy workflow is a separate
reviewed change after representative content and design validation.

References:

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Pagefind Component UI](https://pagefind.app/docs/search-ui/)
