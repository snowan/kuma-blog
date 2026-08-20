# Kuma Blog publishing runbook

This runbook separates drafting, local review, publication authorization, and
post-merge verification. It does not authorize any current draft for
publication.

## Lifecycle

```text
studio research or legacy source
  -> src/content entry with status: draft
  -> editorial, source, privacy, and visual review
  -> explicit approval for exact status changes
  -> merge to master and automatic Pages deployment
  -> exact-SHA route and feed verification
```

Repository presence is not publication. Production routes, search, RSS, and
the sitemap include only entries with `status: published`.

## Review drafts without publishing

Install the locked dependency graph, then start the development-only preview:

```bash
pnpm install --frozen-lockfile
pnpm dev:drafts --host 127.0.0.1 --port 4321
```

Open the base-prefixed index or an exact draft route:

```text
http://127.0.0.1:4321/kuma-blog/writing/<slug>/
http://127.0.0.1:4321/kuma-blog/lab-notes/<slug>/
http://127.0.0.1:4321/kuma-blog/visuals/<slug>/
```

Draft pages show a local-preview banner and `noindex`. The preview gate requires
both Astro development mode and `KUMA_PREVIEW_DRAFTS=1`. A production build
ignores the flag and continues to exclude drafts. Never change a draft to
`published` temporarily for visual review.

## Publication review

For every exact entry proposed for publication, confirm:

1. The reader question, outcome, content type, topic, and presentation are
   explicit.
2. Sourced facts, direct observations, inference, and opinion are distinct.
3. Primary sources support changing technical claims near the claim.
4. Experiments identify environment, variables, failures, interventions,
   limitations, and inspectable privacy-safe evidence.
5. Related posts have distinct outcomes or a documented consolidation record.
6. Images have useful alternative text, captions where needed, provenance, and
   public-use rights.
7. Desktop and 320–360 px review passes for the selected presentation, with no
   keyboard, focus, overflow, contrast, or console defect.
8. Unslop and readability findings were reviewed in context rather than
   mechanically rewritten.
9. The exact route and any legacy redirect intent are recorded.
10. No secret, private data, raw internal trace, hidden reasoning, or
    identifying artifact is present.

## Required publication change

The publication PR must name every exact path whose `status` changes. Set:

- `status: published`;
- `publishedAt` to the actual publication date;
- `updatedAt` when revising an earlier public entry;
- `lastVerified` when factual freshness matters;
- a reviewed cover with alt text for a published visual.

Do not combine publication with legacy deletion, archive moves, dependency
updates, or unrelated site changes.

Merging a publication PR to `master` triggers GitHub Pages automatically.
Therefore, do not mark the PR ready or merge it without explicit authorization
for those exact publication changes.

## Verification

Before review:

```bash
pnpm verify
pnpm audit --prod
```

`pnpm verify` performs two production builds. The second sets
`KUMA_PREVIEW_DRAFTS=1` deliberately and proves that the development preview
flag still cannot leak drafts into production output or discovery feeds.

After merge:

1. Record the merge SHA.
2. Require Site CI and the Pages deployment to succeed for that exact SHA.
3. Confirm the canonical route returns 200 below `/kuma-blog/`.
4. Confirm the entry appears in its intended index, RSS, sitemap, and search.
5. Recheck a known remaining draft route returns 404.
6. Revert the exact publication commit if the artifact or route is wrong.
