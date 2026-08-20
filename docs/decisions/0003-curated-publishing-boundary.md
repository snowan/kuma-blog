# ADR 0003: Deploy generated curated output only

- Status: accepted for future implementation
- Date: 2026-08-20
- Scope: repository and deployment boundary

## Context

The repository contains reader-facing articles alongside drafts, raw research,
prompts, generated intermediates, applications, historical notes, and large
asset collections. Uploading the repository root to GitHub Pages does not create
a coherent publication and can expose material that was never reviewed for a
public article feed.

## Decision

Only Astro's generated `dist/` directory may be used as the GitHub Pages
artifact. Published entries originate from reviewed content collections under
`src/content/`.

The following are excluded from the site unless an exact artifact is explicitly
selected:

- `studio/`
- `archive/`
- Raw `labs/` contents
- Operational files, workflows, and repository metadata
- Source packages and dependency archives
- Drafts, prompts, storyboards, and generated intermediates

## Consequences

- Repository presence and website publication are separate states.
- Search, RSS, sitemap, topic pages, and related-article indexes include only
  entries with `status: published`.
- Public downloads require an explicit allowlist.
- Build tests must inspect `dist/` for excluded paths and unexpected files.
- The public repository remains visible, so deployment exclusion is not a
  privacy mechanism.

## Guardrail

This record does not replace the GitHub Pages workflow or authorize deployment.
A later PR must build, inspect, and verify the artifact below `/kuma-blog/`, and
deployment requires explicit authorization.
