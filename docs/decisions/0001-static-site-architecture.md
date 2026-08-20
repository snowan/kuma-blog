# ADR 0001: Use custom Astro for the curated site

- Status: accepted for future implementation
- Date: 2026-08-20
- Scope: architecture decision only

## Context

Kuma Blog contains long-form Markdown, code, diagrams, visual explainers,
research support files, applications, and legacy collections. GitHub Pages
should expose a coherent publication without publishing the repository root.

The retained architecture research compared Jekyll, Hugo, Astro themes, and a
custom Astro implementation. Kuma Blog needs validated metadata, topic and
series indexes, static search, responsive images, RSS, sitemap support, and a
distinct editorial design while remaining fully static.

## Decision

Use a custom Astro static site informed by AstroPaper's content, accessibility,
and publishing architecture. Do not copy AstroPaper's visual identity.

Use:

- Astro static output and TypeScript
- Content collections with validated frontmatter
- Scoped CSS and shared Kuma design tokens
- Markdown by default and MDX only when custom components are necessary
- Static search, RSS, sitemap, code highlighting, and responsive images
- A project-site base path of `/kuma-blog/` until a custom domain is approved

## Consequences

- Kuma owns and must test its design system and components.
- The initial implementation is larger than installing an existing theme.
- Content can be published from an explicit collection instead of the
  repository root.
- Drafts, archives, labs, and support material can remain in the repository
  without entering the deployed artifact.

## Guardrail

This decision does not scaffold Astro, install dependencies, change the Pages
workflow, publish content, or deploy a site. Those actions require separate
review and authorization.
