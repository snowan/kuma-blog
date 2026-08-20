# Kuma Blog

Field notes on reliable AI systems: agents and harnesses, memory and context,
evals and reliability, and inference systems.

[Read the GitHub Pages site](https://snowan.github.io/kuma-blog/) ·
[Editorial policy](docs/editorial/editorial-policy.md) ·
[Publishing runbook](docs/runbooks/publishing.md) ·
[Research roadmap](docs/editorial/research-and-writing-roadmap.md) ·
[Target architecture](docs/architecture/information-architecture.md) ·
[Reorganization proposal](docs/migration/reorganization-batches.yml)

## Repository boundary

Kuma Blog currently contains two deliberately separate layers:

- `src/` is the curated Astro publication. Only reviewed entries with
  `status: published` may enter the generated site.
- The legacy roots contain research, visual sources, applications, algorithms,
  book notes, and personal material. They remain visible in the public Git
  repository but are excluded from the generated Pages artifact.

The target model separates publication, labs, studio material, and archive
content. It will be implemented in small, explicitly approved migration PRs;
the proposal does not authorize moves or deletion.

```text
kuma-blog/
├── src/       # reviewed public site and content collections
├── labs/      # reproducible, privacy-safe experiments
├── studio/    # drafts, research, prompts, and intermediates
├── archive/   # preserved legacy notes outside the site
├── public/    # explicitly reviewed static downloads
├── tools/     # site and content validation
├── tests/     # content, links, accessibility, and base-path checks
└── docs/      # architecture, decisions, policy, and migration records
```

See the [information architecture](docs/architecture/information-architecture.md)
for the complete proposed folder structure and URL model.

## Local development

Requirements: Node.js 22.12 or newer and pnpm 10.8.1 or newer.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Use `pnpm dev:drafts` for a development-only review of draft article routes.
It does not change metadata and cannot enable drafts in a production build.

The production site is a static Astro build configured for the GitHub Pages
project path `/kuma-blog/`.

```bash
pnpm verify
```

Verification runs Astro diagnostics, contrast checks, the production build,
Pagefind indexing, base-path checks, route checks, and artifact leakage checks.

## Content workflow

1. Research or draft outside the public collection.
2. Apply the editorial evidence and privacy checklist.
3. Add reviewed content under `src/content/` with validated metadata.
4. Test the selected Paper Journal, Control Room, or Mori Notebook presentation.
5. Request publication approval separately from deployment approval.

Repository presence is not publication. Draft entries are excluded from the
production artifact.

## Legacy reorganization

The latest audit covers 286 tracked Markdown and MDX documents. Its scanner
results are triage cues, not authorship or deletion verdicts. Review the
[audit snapshot](docs/migration/2026-08-20-reorganization-audit.md) and
[proposed batches](docs/migration/reorganization-batches.yml) before changing a
legacy path.

No archive move or deletion is approved by those records. Every implementation
PR must use an exact path ledger, check links and redirects, preserve protected
translations and variants, and provide a rollback.

## License and contributions

The repository is licensed under the [MIT License](LICENSE). Corrections and
focused improvements are welcome through issues or small pull requests.
