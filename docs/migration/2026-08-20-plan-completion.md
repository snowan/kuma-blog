# Kuma Blog plan completion audit

- Date: 2026-08-20
- Verified base revision: `7c743b6714baea812470354e4006c8d4c7eb60d5`
- Final workflow implementation: this change
- Scope: all non-destructive work authorized by the approved plan

The planned design, site foundation, curated content drafts, GitHub Pages
deployment, repository audit, migration proposal, link repair, dependency
maintenance, and publishing workflow are implemented. No legacy file was moved
or deleted, and no draft was published without exact authorization.

## Pull request ledger

| PR | Merge commit | Outcome |
| --- | --- | --- |
| [#129](https://github.com/snowan/kuma-blog/pull/129) | `af594c2` | Added the approved design guide, repository instructions, local design/editorial skills, architecture research, content map, URL map, and initial proposal. |
| [#130](https://github.com/snowan/kuma-blog/pull/130) | `e852cf6` | Built the custom Astro static-site foundation, validated content schema, base-path handling, search, RSS, sitemap, and deployment-boundary tests. |
| [#131](https://github.com/snowan/kuma-blog/pull/131) | `6fb7f94` | Implemented the shared Paper Journal, Control Room, and Mori Notebook presentation system with accessible components. |
| [#132](https://github.com/snowan/kuma-blog/pull/132) | `5972d17` | Prepared the canonical harness concept, implementation guide, and visual explainer as drafts while preserving legacy sources. |
| [#133](https://github.com/snowan/kuma-blog/pull/133) | `ebd5f8c` | Replaced the Pages artifact with the verified Astro `dist/` build and deployed the curated site. |
| [#134](https://github.com/snowan/kuma-blog/pull/134) | `cae1a41` | Prepared two distinct context-engineering drafts after source and overlap review. |
| [#135](https://github.com/snowan/kuma-blog/pull/135) | `9f8828e` | Prepared the memory survey, practical deep dive, and original visual learning series as drafts. |
| [#136](https://github.com/snowan/kuma-blog/pull/136) | `aee25b6` | Prepared the agent-evals, serving-control-plane, and admission-control drafts with refreshed primary sources. |
| [#137](https://github.com/snowan/kuma-blog/pull/137) | `489df4e` | Refreshed the repository audit and proposed 12 exact, ordered, approval-gated reorganization batches. |
| [#138](https://github.com/snowan/kuma-blog/pull/138) | `4d8fec9` | Repaired the two verified legacy image links; the full link audit now passes. |
| [#139](https://github.com/snowan/kuma-blog/pull/139) | `7c743b6` | Patched Python dependency alerts, upgraded GitHub Actions, fixed Dependabot paths, and removed all open Dependabot alerts. |
| Final workflow change | This change | Adds development-only draft preview, dynamic draft-leak tests, labs/studio contracts, publishing and lab runbooks, a PR checklist, and the research roadmap. |

## Final content audit

The final proposed tree was scanned in Unslop report-only mode. Scanner output
orders human review; it is not an authorship probability or deletion verdict.

| Signal | Result |
| --- | ---: |
| Markdown and MDX documents | 294 |
| Reader-facing post candidates | 190 |
| Support or operational documents | 104 |
| Words | 275,246 |
| Complete scans | 294 |
| Partial or failed scans | 0 |
| Hard phrase findings | 15 across 11 legacy documents |
| Soft phrase findings | 29 |
| Exact duplicate groups | 1 |
| Similar pairs at cosine similarity at least 0.72 | 11 |
| Broken relative links | 0 |

The 15 entries under `src/content/` have zero hard and zero soft phrase
findings. Similarity review protects translations, related algorithm variants,
the distinct context-engineering theses, and the three-format memory series.
The only exact duplicate group remains the two zero-byte placeholders already
listed for separate deletion approval.

## Publication and deployment state

- Eleven canonical reader-facing outputs are prepared as drafts.
- Four schema fixtures also remain drafts.
- Production builds expose no draft route, search result, RSS item, or sitemap
  entry.
- `pnpm dev:drafts` exposes drafts only in Astro development mode and labels
  them with a visible noindex banner.
- `pnpm verify` now performs a second production build with the preview flag
  deliberately set; 23 pages and 62 generated files still pass the dynamic
  non-published-entry leakage check.
- The live GitHub Pages home returns 200 below `/kuma-blog/`; sampled draft
  routes return 404.

Publication remains an explicit content decision. Merging a future status
change to `master` deploys automatically, so the publishing runbook requires
exact authorization before a publication PR is marked ready or merged.

## Design verification

The final local draft-preview implementation was checked in a real browser:

- Paper Journal, Control Room, and Mori Notebook at 1280 px and 320 px;
- correct presentation token on every route;
- visible local-draft banner and `noindex` metadata;
- no horizontal overflow;
- zero browser console errors;
- visible keyboard focus beginning at the skip link;
- shared 72ch article measure and responsive navigation retained.

The production suite reports 47 Astro files with zero errors, warnings, or
hints, and all presentation color pairs meet WCAG AA contrast thresholds.

## Repository and security state

- GitHub Pages deploys only the generated Astro artifact.
- Legacy, studio, raw lab, dependency archive, and draft material remain outside
  the artifact boundary.
- The two known relative-link defects are repaired.
- Python 3.11 dependency resolution, Black, and all 34 Telegram bot tests pass;
  three pre-existing AsyncMock cleanup warnings remain documented.
- Python `pip-audit` and production `pnpm audit` report no known
  vulnerabilities.
- GitHub reports zero open Dependabot alerts.
- Current checkout, setup-python, setup-node, and pnpm setup action majors run
  successfully on both pull-request and default-branch CI.

## Decisions deliberately left gated

These are not unfinished implementation defects. They require authority that
the approved proposal explicitly withheld:

| Decision | Required authorization |
| --- | --- |
| Publish any of the 11 canonical outputs | Approve every exact draft-to-published path and its automatic Pages deployment. |
| Move a legacy collection into `archive/` | Approve an expanded exact-path ledger, destination, link behavior, and rollback for one batch. |
| Delete the two empty placeholders | Approve both exact zero-byte paths after inbound-link confirmation. |
| Retire a canonical merge source | Publish and verify its replacement, then approve an exact archive or deletion action. |
| Split visual material into publication and studio layers | Complete and approve an owner, provenance, role, license, and byte-size ledger. |
| Move embedded agent applications | Approve a labs-versus-dedicated-repository ADR that preserves tests, CI paths, and rollback. |
| Rewrite Git history or adopt Git LFS | Make a separate storage decision after the asset ledger; neither is implied by reorganization. |

## Recommended next approvals

1. Review the harness concept, guide, and visual through `pnpm dev:drafts` and
   decide whether to authorize that first publication batch.
2. If archive work is desired, begin with the two dated AI-news reports because
   the batch is small, text-only, and low-coupling.
3. Approve or reject deletion of the two empty placeholders separately.
4. Build the visual asset owner/license ledger before moving or optimizing any
   binary collection.
5. Start the first new original experiment from the research roadmap: bounded
   retry versus checkpoint-and-handoff recovery under the same model and task
   set.

All safe implementation work in the approved plan is complete. The remaining
items are review decisions, not permission to mutate content automatically.
