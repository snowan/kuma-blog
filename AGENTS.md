# Kuma Blog repository instructions

These instructions apply to the entire repository.

## Purpose

Kuma Blog is a personal, source-grounded publication about AI systems, agents,
agent harnesses, memory and context, evaluation, reliability, and related
engineering practice. Optimize reader-facing work for clarity, original
analysis, and durable learning rather than content volume.

## Sources of truth

- Follow the approved visual and article system in
  [`docs/design/kuma-blog-design-system.md`](docs/design/kuma-blog-design-system.md).
- Follow the evidence, lifecycle, overlap, and publication requirements in
  [`docs/editorial/editorial-policy.md`](docs/editorial/editorial-policy.md).
- Treat
  [`docs/architecture/information-architecture.md`](docs/architecture/information-architecture.md)
  as the target structure for incremental migration, not permission for a
  one-shot move.
- Check
  [`docs/migration/content-map.yml`](docs/migration/content-map.yml) and
  [`docs/migration/url-map.yml`](docs/migration/url-map.yml) before changing an
  existing content path. Entries marked pending still require the stated
  approval.
- Use the approved interactive reference in
  [`designs/kuma-blog-top-three/Kuma Blog Top Three.html`](designs/kuma-blog-top-three/Kuma%20Blog%20Top%20Three.html)
  when visual behavior or tokens are ambiguous.
- Treat [`docs/site-research/2026-08-18-github-pages-design.md`](docs/site-research/2026-08-18-github-pages-design.md)
  as architecture research, not proof that the Astro migration or GitHub Pages
  deployment has happened.
- Treat content-audit scores as review cues, never authorship probabilities or
  automatic deletion verdicts.

## Working rules

1. Inspect `git status --short --branch` before editing. Preserve unrelated
   local work and stage only the paths that belong to the current change.
2. Audit and propose before deleting, moving, merging, or archiving posts.
   Require explicit approval before applying a destructive content plan.
3. Search for related posts before adding a new one. When substantial overlap
   exists, recommend a canonical article and identify unique material to merge.
4. Keep research notes, prompts, storyboards, and generated intermediates
   distinct from published articles. Do not present support files as finished
   writing.
5. Do not commit, push, deploy, publish, or change GitHub Pages settings unless
   the user explicitly authorizes that action.

## Design rules

- Paper Journal is the default site and reading shell.
- Control Room is for technical guides, experiments, traces, evals, and
  runbooks.
- Mori Notebook is for personal field notes and illustrated essays.
- All three presentations share the same information architecture, semantic
  components, navigation, metadata, accessibility behavior, and URL model.
- Keep article text at a maximum measure of `72ch`, with left-aligned copy and
  comfortable line spacing. Wide figures may break out of the text column.
- Show published and updated dates, reading time, content type, sources, and a
  last-verified date when factual freshness matters.
- Give meaningful images and diagrams alt text and captions. Make tables, code
  blocks, and diagrams responsive. Do not use a permanent mobile sidebar.
- Prefer restrained, content-supporting motion and honor reduced-motion
  preferences. Preserve keyboard navigation, visible focus, and sufficient
  contrast.
- Avoid fabricated dashboards, telemetry, benchmarks, terminal output, and
  decorative controls that imply nonexistent functionality.
- Keep Japanese-inspired work original. Do not copy recognizable characters,
  locations, compositions, or trade dress from Studio Ghibli or another artist.

## Editorial rules

- Lead with a specific reader question, claim, experiment, or system problem.
- Separate sourced fact, direct observation, inference, and opinion. Never
  invent citations, measurements, quotations, experiments, or production use.
- Prefer primary sources for technical claims. Put citations near the claims
  they support and include a concise sources section.
- State what was tested, the environment, limitations, and failure modes for
  technical tutorials and experiments.
- Preserve the author's voice. Fix unsupported certainty, weak structure,
  repetition, and missing evidence before polishing vocabulary.
- Use automated prose scanners only as triage. Review findings in context and
  do not optimize writing to evade AI detectors.

## Local skills

- Use [`kuma-blog-design`](.agents/skills/kuma-blog-design/SKILL.md) for site,
  component, template, or visual-system work.
- Use [`kuma-blog-editorial`](.agents/skills/kuma-blog-editorial/SKILL.md) for
  planning, drafting, consolidating, or reviewing posts.

## Validation

Run checks proportional to the change:

- Always run `git diff --check` and review the exact staged and unstaged diff.
- For visual changes, verify the homepage and article layouts at desktop and
  mobile widths, keyboard focus, overflow, and all three presentations.
- For broad editorial or reorganization work, run the repository audit when
  the local Unslop dependency is available:

  ```bash
  python3 scripts/content_audit.py \
    --output-dir /tmp/kuma-blog-content-audit \
    --workers 8 \
    --similarity-threshold 0.72 \
    --top 60
  ```

  Report unavailable dependencies or partial scans instead of silently
  omitting them.
- For Astro work, follow
  [`docs/runbooks/site-development.md`](docs/runbooks/site-development.md) and
  require its build, type, link, accessibility, and `/kuma-blog/` base-path
  checks before deployment.
