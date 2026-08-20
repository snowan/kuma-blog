## Outcome

Describe the reader, repository, or operational outcome. Name the exact paths
and keep unrelated work out of the PR.

## Change type

- [ ] Editorial or research draft
- [ ] Site, design, or accessibility
- [ ] Lab artifact or experiment
- [ ] Documentation or governance only
- [ ] Publication status change
- [ ] Move, archive, redirect, or deletion
- [ ] Dependency, CI, or deployment

## Authorization boundary

- [ ] This PR does not publish, move, archive, delete, or rewrite history.
- [ ] Or: the PR links explicit approval for every exact mutating path and
      describes rollback.

For publication PRs, list every `draft` to `published` transition and remember
that merge to `master` triggers GitHub Pages deployment.

## Evidence and overlap

- Related content searched:
- Sources or experiment evidence reviewed:
- Consolidation, migration, or URL record:
- Privacy, provenance, and license notes:

## Verification

- [ ] Exact diff and `git diff --check`
- [ ] Relevant content audit or report-only Unslop review
- [ ] `pnpm verify` for Astro changes
- [ ] Desktop and 320–360 px visual review for design/article changes
- [ ] Dependency or application tests when affected
- [ ] Post-merge exact-SHA CI and Pages verification planned

Record commands, results, known warnings, and anything deliberately not tested.

