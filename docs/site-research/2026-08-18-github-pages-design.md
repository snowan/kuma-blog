# Kuma Blog GitHub Pages architecture and design research

Date: 2026-08-18
Status: research and design recommendation; the production site has not been migrated or deployed

## Executive recommendation

Build a custom static Kuma Blog theme with Astro, using AstroPaper as a feature and accessibility reference rather than adopting its default visual design unchanged. Deploy the generated `dist/` directory directly to GitHub Pages with Astro's official `withastro/action` workflow.

This gives Kuma Blog:

- A distinctive editorial identity rather than another recognizable theme installation
- Markdown and MDX content with validated frontmatter
- Static full-text search without a server
- RSS, sitemap, canonical URLs, Open Graph metadata, code highlighting, diagrams, and responsive images
- A fully static deployment with no database or application server
- A clean boundary between reader-facing content and the repository's drafts, experiments, archives, and production assets

The recommended visual direction is **research field journal**: warm paper, precise typography, small system diagrams, restrained color, and article-first navigation. It should feel like a practiced engineer's notebook, not an AI dashboard or template gallery.

## Current live state

The repository is configured as a public GitHub Pages project site at `https://snowan.github.io/kuma-blog/`, but the URL currently returns HTTP 404.

The five most recent Pages workflow runs are failures. The retained annotation for the latest run is:

```text
Unable to resolve action actions/setup-pages, repository not found
```

The workflow references `actions/setup-pages@v4`. GitHub's current documented action is `actions/configure-pages@v5`; `actions/setup-pages` is not the correct repository. The workflow also uploads `.` without generating HTML from Markdown, so even a successful run would publish the repository tree rather than a coherent blog.

Other migration constraints:

- 256 tracked Markdown documents
- Only 25 tracked Markdown documents currently start with YAML frontmatter
- 306 image files outside virtual environments: 272 PNG, 26 JPG, 1 JPEG, and 7 SVG
- The repository is a project site, so generated routes and assets must work beneath `/kuma-blog/` unless a custom domain is configured
- The current homepage mixes research content with fake telemetry and legacy collections, while the editorial goal is AI agents, harnesses, memory, evaluation, and reliability

## What GitHub Pages supports

GitHub Pages can deploy output from any static site generator through a custom GitHub Actions workflow. GitHub recommends deploying a generated artifact rather than uploading unrelated repository files. Astro maintains an official action that builds the site and uploads its `dist/` output for `actions/deploy-pages`.

Sources:

- [GitHub Pages: creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub Pages: custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Astro: deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Official Astro Pages action](https://github.com/withastro/action)

GitHub currently recommends a source repository under 1 GB, limits a published Pages site to 1 GB, times deployments out after 10 minutes, and applies a soft 100 GB monthly bandwidth limit. This makes selective publishing and image optimization important for Kuma Blog.

Source: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## Generator and template comparison

The scores below reflect Kuma Blog's actual needs: hundreds of Markdown files, technical code and diagrams, visual explainers, static search, an opinionated editorial homepage, and GitHub Pages deployment.

| Option | Strengths | Weaknesses for Kuma Blog | Fit |
| --- | --- | --- | ---: |
| Jekyll + Chirpy | Mature technical-writing layout, search, categories, tags, TOC, Mermaid, feeds, and native GitHub familiarity | Ruby toolchain, recognizable sidebar theme, stronger coupling to Jekyll conventions, and less freedom for an editorial/visual homepage | 7/10 |
| Jekyll + Minimal Mistakes | Very mature, GitHub Pages compatible, flexible collections, many skins | Visually conventional, more configuration and plugin history, and would still require substantial custom design | 6/10 |
| Hugo + PaperMod | Extremely fast builds, stable, minimal, multilingual, and widely used | The default design is too generic for a distinctive Kuma identity; custom visual components and content migration are less natural for this repository | 7/10 |
| Hugo + Blowfish | Strong article series, search, diagrams, related articles, shortcodes, image handling, and many layouts | Feature-heavy theme surface and theme configuration would become the site's architecture | 7.5/10 |
| Astro + Fuwari | Attractive visual cards, search, TOC, RSS, smooth transitions, and strong visual-content support | Its pastel/anime profile layout competes with the desired research-journal identity and carries more visual behavior than Kuma needs | 7.5/10 |
| AstroPaper | Accessible, minimal, fast, type-safe Markdown, static search, RSS, sitemap, SEO, TOC, drafts, tags, archives, light/dark modes, and active maintenance | Default presentation is intentionally plain and does not provide Kuma's topic-led homepage or visual-explainer identity | 9/10 foundation |
| Custom Astro informed by AstroPaper | Best editorial fit, content schemas, component flexibility, static output, image pipeline, and small JavaScript footprint | More initial implementation and migration work; Kuma owns the design system and tests | **9.5/10** |

Reference projects were checked live on 2026-08-18. All are MIT licensed and unarchived:

- [AstroPaper](https://github.com/satnaing/astro-paper): 4,968 stars; pushed 2026-08-05
- [Fuwari](https://github.com/saicaca/fuwari): 4,923 stars; pushed 2026-03-10
- [Hugo PaperMod](https://github.com/adityatelange/hugo-PaperMod): 13,844 stars; pushed 2026-08-02
- [Blowfish](https://github.com/nunocoracao/blowfish): 2,871 stars; pushed 2026-08-17
- [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy): 10,229 stars; pushed 2026-07-30
- [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes): 13,556 stars; pushed 2026-08-11

Popularity is not the deciding factor. Astro's content collections can validate every post's frontmatter with a schema, which directly addresses Kuma Blog's inconsistent metadata and supports generated topic, series, archive, and related-article pages.

Sources: [Astro content collections](https://docs.astro.build/en/guides/content-collections/), [AstroPaper features](https://github.com/satnaing/astro-paper/wiki/Features), [Fuwari](https://github.com/saicaca/fuwari), [PaperMod](https://themes.gohugo.io/themes/hugo-papermod/), [Blowfish](https://github.com/nunocoracao/blowfish), [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy), [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)

## Recommended technical architecture

### Core stack

- Astro static output
- TypeScript for content schemas and build-time logic
- Plain scoped CSS with Kuma design tokens; no React and no general-purpose UI framework
- Markdown by default; MDX only for posts that need interactive diagrams or custom components
- Astro content collections with Zod schemas
- Shiki or Expressive Code for code blocks
- Pagefind for static search
- `@astrojs/rss` and `@astrojs/sitemap`
- Astro's local image service for responsive WebP/AVIF generation
- Optional Mermaid rendering for architecture diagrams
- Optional giscus comments, disabled initially

Pagefind generates its index after the static site build and embeds the result into the site; it has no server component. Giscus can add comments through GitHub Discussions without a separate database, but requires visitors to authenticate with GitHub and should be an explicit later product decision.

Sources: [Pagefind](https://pagefind.app/docs/), [Astro images](https://docs.astro.build/en/guides/images/), [giscus](https://giscus.app/)

### Proposed Astro layout

```text
kuma-blog/
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   ├── posts/
│   │   ├── field-notes/
│   │   └── pages/
│   ├── components/
│   │   ├── site/
│   │   ├── article/
│   │   ├── search/
│   │   └── diagrams/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── posts/[...slug].astro
│   │   ├── topics/[topic].astro
│   │   ├── series/[series].astro
│   │   ├── archive.astro
│   │   ├── search.astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── styles/
│   └── assets/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── CNAME                 # only after choosing a custom domain
├── archive/                  # repository archive; excluded from content collection
├── studio/                   # public working material; excluded from website
├── labs/                     # public experiment code; linked selectively
├── tools/
├── tests/
└── dist/                     # generated; ignored and deployed
```

### Post schema

Every published document should eventually provide:

```yaml
---
title: "How to Build an Agent Harness"
description: "A practical guide to control loops, tools, state, and recovery."
publishedAt: 2026-03-22
updatedAt: 2026-08-18
status: published
type: essay
topic: agents-harnesses
series: harness-lab
tags: [agents, harnesses, evaluation]
featured: true
draft: false
lastVerified: 2026-08-18
canonicalUrl:
cover:
---
```

The migration script should infer a provisional title and Git commit date, but every description, topic, series, featured flag, and canonical URL requires editorial review.

## Design direction: Kuma Research Journal

### Principles

1. **Article first.** The homepage should immediately communicate what Michi studies and writes about.
2. **Evidence visible.** Post cards distinguish essays, field notes, experiments, and visual explainers.
3. **Technical without dashboard theater.** Use small diagrams and metadata, not fabricated telemetry or generic glass panels.
4. **Warm, personal, precise.** The bear identity should appear in the mark and small details, not cartoon decoration across every page.
5. **Readable long-form pages.** Use a 68–72 character measure, visible TOC on wide screens, excellent code blocks, source notes, and last-verified metadata.

### Visual system

- Light background: warm paper `#F6F1E8`
- Dark background: charcoal-blue `#111318`
- Primary ink: `#1A1D1A`
- Technical blue: `#3159C6`
- Annotation orange: `#D9683A`
- Quiet sage: `#DCE5D8`
- Display type: Newsreader or another restrained editorial serif
- Interface and body type: Inter or a high-quality system sans
- Code: system monospace
- Fonts should be self-hosted in production to avoid a third-party request

### Homepage anatomy

1. Compact masthead: Kuma Blog, Writing, Topics, Lab Notes, Visuals, About, Search, Theme
2. Clear position statement: “Field notes on reliable AI systems”
3. One featured article with a real system diagram
4. Four topic entries: Harnesses, Memory and Context, Evals and Reliability, Inference Systems
5. Latest writing as a calm editorial list rather than a dense card wall
6. One horizontal visual-explainer feature
7. Research-thread links that show what is being tested next
8. RSS, GitHub, source methodology, and archive in the footer

### Article page anatomy

- Breadcrumb and content type
- Title, description, date, update date, reading time, and last verified
- Optional series navigation
- Article body with wide figures that can break out of the text column
- Sticky TOC only on wide screens
- Sources and revision history near the end
- Previous/next within the same series
- Optional giscus comments only after the publication workflow is stable

## GitHub Pages deployment

The Astro project should set:

```js
export default defineConfig({
  site: "https://snowan.github.io",
  base: "/kuma-blog",
  output: "static",
});
```

Use Astro's official action instead of manually uploading the repository:

```yaml
name: Deploy Kuma Blog

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24
          package-manager: pnpm@10

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

The package-manager lockfile must be committed. Internal links and static assets must consistently include Astro's base path. If a custom domain is added later, remove `base`, change `site`, add `public/CNAME`, and configure the domain in repository settings.

## Migration plan

### Phase 1: working site shell

- Scaffold Astro without moving existing content
- Implement the Kuma design system and homepage
- Add one canonical harness article and one visual explainer
- Add search, RSS, sitemap, metadata, 404, and base-path tests
- Replace the broken Pages workflow

### Phase 2: focused publication

- Migrate the canonical harness pair
- Migrate selected memory/context and inference articles
- Backfill reviewed frontmatter
- Establish redirects from old paths
- Keep the legacy repository tree excluded from `dist/`

### Phase 3: archive and lab integration

- Publish topic indexes and series navigation
- Expose selected lab results from `labs/`
- Move system-design and Leetcode material into the archive
- Optimize visual assets and move production files out of reader-facing paths

### Phase 4: optional community layer

- Custom domain
- giscus comments
- Privacy-respecting analytics only if there is a concrete editorial question to answer
- Newsletter integration only after a consistent publishing cadence exists

## Acceptance criteria

- `pnpm build` and `astro check` pass locally
- All published content passes the frontmatter schema
- No broken internal links or missing images
- Generated site stays comfortably below GitHub Pages' 1 GB limit
- Homepage and articles work at `/kuma-blog/`, not only at `/`
- Pagefind indexes only published content
- Drafts, studio files, raw research, archives, `.git`, packages, and virtual environments are absent from `dist/`
- RSS, sitemap, canonical URLs, Open Graph images, and 404 page work
- Keyboard navigation, visible focus, reduced-motion behavior, color contrast, and responsive layouts are tested
- Lighthouse targets: at least 95 for accessibility, best practices, and SEO on the homepage and a representative article
- The GitHub Pages deployment succeeds and the deployed commit matches the reviewed local build

## Decision

Choose **custom Astro with AstroPaper-informed content plumbing**. Do not adopt the existing dark bento homepage, Fuwari's profile-card aesthetic, or a generic PaperMod/Minimal Mistakes installation. Kuma Blog has enough distinct material to justify a tailored editorial identity, while Astro keeps that custom design fully static and directly deployable to GitHub Pages.
