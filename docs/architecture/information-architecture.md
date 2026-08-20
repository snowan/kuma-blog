# Kuma Blog information architecture

Status: target architecture for incremental implementation. No content is moved
or published by this document.

## Architecture decision

Kuma Blog is one repository with four deliberately separated domains:

| Domain | Responsibility | Included in GitHub Pages |
| --- | --- | --- |
| Publication | Reviewed articles, pages, and approved media | Yes |
| Labs | Reproducible code, data, and experiment evidence | Linked selectively |
| Studio | Drafts, research, prompts, storyboards, and intermediates | No |
| Archive | Preserved legacy notes and retired material | No |

The generated website is a curated product. It is not a rendering of every file
in the repository.

## Target repository structure

```text
kuma-blog/
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   ├── writing/
│   │   │   ├── agents-harnesses/
│   │   │   ├── memory-context/
│   │   │   ├── evals-reliability/
│   │   │   └── inference-systems/
│   │   ├── lab-notes/
│   │   │   ├── agents-harnesses/
│   │   │   ├── memory-context/
│   │   │   ├── evals-reliability/
│   │   │   └── inference-systems/
│   │   ├── visuals/
│   │   │   ├── agents-harnesses/
│   │   │   ├── memory-context/
│   │   │   └── inference-systems/
│   │   └── pages/
│   ├── components/
│   │   ├── site/
│   │   ├── article/
│   │   ├── diagrams/
│   │   ├── search/
│   │   └── presentations/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── assets/
├── studio/
│   ├── inbox/
│   ├── drafts/
│   ├── research/
│   ├── source-ledgers/
│   ├── prompts/
│   ├── storyboards/
│   └── generated/
├── labs/
│   ├── experiments/
│   └── shared/
├── archive/
│   ├── ai-news-digests/
│   ├── system-design/
│   ├── leetcode/
│   ├── books/
│   ├── setup/
│   ├── personal/
│   └── legacy-ai/
├── public/
│   └── downloads/
├── tools/
│   ├── content/
│   ├── migration/
│   ├── links/
│   └── assets/
├── tests/
│   ├── content/
│   ├── links/
│   ├── accessibility/
│   └── base-path/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── design/
│   ├── editorial/
│   ├── migration/
│   └── runbooks/
├── designs/
└── dist/
```

This is a target model, not a one-shot directory move. Existing paths remain in
place until a later PR approves an exact migration batch and its URL behavior.

## Public navigation

Use one compact navigation model:

```text
Writing · Topics · Lab Notes · Visuals · About · Search
```

The homepage position is:

> Field notes on reliable AI systems

The homepage provides:

1. One featured article with a meaningful visual or system diagram
2. Entry points for the four primary technical topics
3. Latest writing as an editorial list
4. One visual-explainer feature
5. Current research threads or questions
6. RSS, GitHub, methodology, and archive links

## Content collections

### Writing

Canonical essays, research syntheses, reviews, and technical guides. Storage is
organized by topic; `type` and `series` metadata provide secondary groupings.

### Lab notes

Experiments, evaluation reports, runbooks, traces, and short field observations.
Lab notes should link to a privacy-safe artifact in `labs/` when reproducibility
material exists.

### Visuals

Final visual explainers and illustrated essays. Source notes and accessible text
are published with the visual; prompts and intermediates remain in `studio/`.

### Pages

Stable site pages such as About, Methodology, Now, and editorial indexes.

## Topic and series model

The four primary topics are:

- `agents-harnesses`
- `memory-context`
- `evals-reliability`
- `inference-systems`

Initial series are:

- `harness-lab`
- `memory-lab`
- `agent-reliability-notes`
- `agent-standards-map`

Topics answer “what is this about?” Series answer “what sequence should I read?”
Neither should be inferred solely from a legacy directory name.

## URL model

Canonical routes should be independent of legacy storage paths:

| Content | Route |
| --- | --- |
| Writing | `/writing/<slug>/` |
| Lab note | `/lab-notes/<slug>/` |
| Visual | `/visuals/<slug>/` |
| Topic | `/topics/<topic>/` |
| Series | `/series/<series>/` |
| Archive index | `/archive/` |
| Search | `/search/` |
| Feed | `/rss.xml` |

The GitHub Pages project site must work below `/kuma-blog/`. Application code,
asset references, canonical URLs, and tests must account for that base path.

Before moving an existing document:

1. Record its legacy path and proposed canonical route in `url-map.yml`.
2. Check whether the legacy path has known inbound links.
3. Preserve the slug or generate a static redirect page where practical.
4. Check all internal links and images after the move.
5. Keep the old path until the redirect behavior is reviewed.

GitHub Pages has no server-side redirect rules. Redirects must be implemented as
generated static pages or avoided by retaining a compatible route.

## Shared content contract

All public collections use a shared metadata base:

```yaml
title: "How to Build an Agent Harness"
description: "A practical guide to control loops, tools, state, and recovery."
publishedAt: 2026-03-22
updatedAt: 2026-08-20
lastVerified: 2026-08-20
status: published
type: guide
presentation: control
topic: agents-harnesses
series: harness-lab
tags: [agents, harnesses, evaluation]
featured: true
canonicalUrl:
cover:
```

`status` is one of `draft`, `published`, or `archived`. Production collections
and indexes include only `published` entries. A draft may be rendered in a
review build but must be excluded from the production artifact.

Every article presentation supports the same semantic elements: breadcrumb,
title, description, dates, reading time, optional last-verified date, series
navigation, headings with deep links, figures, captions, sources, revision
history, and related articles.

## Presentation model

The site has one information architecture and three presentation modes:

- Paper Journal (`journal`) is the default.
- Control Room (`control`) serves guides, experiments, evals, traces, and
  runbooks.
- Mori Notebook (`mori`) serves personal field notes, learning journeys, and
  illustrated essays.

Presentation changes design tokens and narrowly scoped components. It must not
fork navigation, metadata, semantic markup, URLs, search behavior, or
accessibility.

## Asset model

- Reviewed article media belongs under `src/assets/articles/<slug>/` so the
  static build can optimize it.
- Stable downloadable artifacts belong in `public/downloads/` only after
  explicit review.
- Raw sources, prompts, storyboards, and intermediate images belong in
  `studio/` and are excluded from the site.
- Temporary generated output should be ignored by default.
- Archive assets remain next to their archived content unless a migration has a
  concrete reader benefit.

Every meaningful published image requires alternative text. Add a caption when
the image's relevance is not obvious from the surrounding text.

## Repository boundary

The generated `dist/` artifact is the only GitHub Pages deployment input. It
must exclude:

- `archive/`
- `studio/`
- Unselected `labs/` content
- Repository metadata and workflows
- Source packages and dependency archives
- Raw research and private or internal-only material

The repository is public, so exclusion from `dist/` is not a privacy boundary.
Secrets and sensitive information must never be committed anywhere in the
repository.

## Migration sequence

1. Record content families, canonical candidates, and URL intent without moves.
2. Build the static site shell and schema using fixtures.
3. Validate all three presentations with shared components.
4. Migrate the canonical harness pair and one visual explainer.
5. Deploy generated output only after explicit authorization.
6. Migrate context, memory, evaluation, and inference content in small batches.
7. Move legacy collections into the archive one collection per reviewed PR.
8. Retire or delete exact files only after separate explicit approval.

## Acceptance criteria for later implementation

- Content schema, type checks, and static build pass.
- Published content has no broken links or missing images.
- The site works at `/kuma-blog/`, not only at `/`.
- Search, RSS, sitemap, canonical metadata, and indexes include only published
  content.
- Drafts, studio material, archives, packages, and repository internals are
  absent from `dist/`.
- Homepage and representative articles work at desktop and 320–360 px widths.
- Keyboard focus, contrast, reduced motion, responsive figures, code, tables,
  and diagrams meet the design-system rules.

## Out of scope for this governance change

- Creating the Astro application
- Moving or editing an existing article
- Consolidating overlapping prose
- Archiving or deleting content
- Replacing the GitHub Pages workflow
- Publishing or deploying a website
