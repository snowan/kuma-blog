# Kuma Blog reorganization audit

- Date: 2026-08-20
- Source revision: `aee25b604cc4db2cb6f6ed19b5f7ae0b42030c0c`
- Scope: tracked Markdown and MDX in a clean worktree
- Mode: Unslop report-only; no automatic edits

This snapshot establishes the evidence used by the repository reorganization
proposal. It does not approve a move, merge, archive, deletion, or publication.

## Coverage

| Signal | Result |
| --- | ---: |
| Documents scanned | 286 |
| Reader-facing post candidates | 190 |
| Support or operational documents | 96 |
| Words | 271,383 |
| Complete scans | 286 |
| Partial or failed scans | 0 |
| Hard phrase findings | 15 across 11 documents |
| Soft phrase findings | 30 |
| Documents with structure flags | 123 |
| Documents with silhouette penalty at least 1.0 | 99 |
| Exact duplicate groups | 1 |
| Similar pairs at cosine similarity at least 0.72 | 11 |
| Broken relative links | 2 |

The scanner classifications are review-ordering signals. They are not
authorship probabilities, quality scores, or deletion verdicts. Structure,
silhouette, and readability findings are especially sensitive to document
genre, code, tables, translations, and compact reference material.

## Public collection result

The 15 documents currently under `src/content/` produced zero hard phrase and
zero soft phrase findings. Two documents received a soft structure flag:

- `src/content/writing/agents-harnesses/demystifying-agent-harness.mdx`
- `src/content/writing/memory-context/filesystem-context-engineering.mdx`

Those flags describe possible ending or cadence patterns. Manual review found
no concrete factual, clarity, or voice defect that justifies rewriting them.
All 15 entries remain drafts; this audit does not authorize publication.

## Concrete integrity defects

These are repair candidates for a later maintenance PR, not reorganization
actions:

| Document | Current target | Proposed repair |
| --- | --- | --- |
| `AI-manga-learnings/future-of-enterprise-software/future-of-enterprise-software.md` | `02-page-chaos.png` | Change the reference to the tracked `02-pager-chaos.png`, after visual confirmation. |
| `Books/Designing-Data-Intensive-Applications/Chapter1-Reliability-Scalability-Maintainability-Applications.md` | `../../../assets/books/design-data-intensive-application/figure1-1.png` | Use the repository-relative depth that resolves to the tracked image, after rendering the note. |

## Exact duplicate review

The only exact duplicate group contains two zero-byte placeholders:

- `Books/System-Performance/Chapter1.md`
- `Readings/2020/Design-Data-Intensive-Application.md`

They contain no unique prose or metadata. They are reasonable deletion
candidates, but deletion still requires explicit approval for both exact paths.
Until then, archive batches must keep them in place or move them without
silently deleting them.

## Similarity triage

| Pair or cluster | Audit interpretation | Proposed disposition |
| --- | --- | --- |
| Rotated-array problem I and II | Related problem statements, not duplicates | Keep distinct. |
| English and Chinese LeetCode solutions | Translation pairs for different readers | Keep distinct. |
| Google and LeetCode chunked-palindrome notes | Likely duplicated problem coverage in separate legacy roots | Move in one algorithm batch; review exact-path consolidation separately. |
| Three legacy harness articles | Substantial overlap | Canonical drafts exist; keep legacy sources until publication, redirects, and retirement receive approval. |
| Two context-engineering legacy sources | Shared setup but different reader outcomes | Canonical drafts exist and remain distinct. |
| Context-engineering and filesystem-context MDX drafts | Related concepts, deliberately different theses | Keep distinct and cross-linked. |
| Memory survey, deep dive, and visual series | Shared taxonomy, different formats and outcomes | Keep all three as one series. |

No translation, algorithm variant, or canonical draft is a deletion candidate
solely because it crossed the similarity threshold.

## Hard finding triage

The 15 hard phrase matches occur only in legacy material. They cluster in:

- `AI/reports/ai_news_20260125.md` (3)
- `AI-blogs/we-are-all-addicted-to-claude-code.md` (2)
- 9 other legacy or support documents with one match each

Most matches are negative-parallel constructions or generic jargon. They are
editorial review cues if a document is selected for publication. They are not
worth rewriting in archive-only material, and they do not block an archive
move.

## Repository weight and ownership

The largest ownership questions are assets rather than prose:

| Scope | Tracked files | Approximate bytes | Recommendation |
| --- | ---: | ---: | --- |
| `AI-manga-learnings/` | 138 | 123,897,772 | Separate reviewed final visuals from prompts, PDFs, and intermediates before any move. |
| `AI-slide-learnings/` | 21 | 88,856,119 | Keep final deck outputs distinct from prompt/source layers. |
| `AI/AI-manga-learnings/` | 11 | 27,446,079 | Migrate only an approved final visual with its article; retain source material in studio. |
| `AI/ai-resources/` | 49 | 117,065,122 | Assign every binary asset to a canonical article, studio source, or archive owner. |
| `travels/` | 14 | 45,634,947 | Archive as one personal collection; do not optimize images until ownership is settled. |
| `assets/` | 96 | 29,756,746 | Move assets only with their owning document. |

The largest tracked object is a 14.6 MB research PDF. Multiple source images
are between 6 MB and 9 MB. GitHub Pages builds only `dist/`, so these files do
not leak into the site artifact, but the public Git repository still carries
their storage and licensing obligations.

## Audit conclusions

1. Keep the curated Astro publication under `src/` independent from legacy
   repository organization.
2. Repair the two verified relative links before moving their owning content.
3. Request exact approval before deleting the two empty placeholders.
4. Archive small, low-coupling text collections before asset-heavy visual and
   personal collections.
5. Keep legacy source paths until canonical drafts are explicitly published
   and any redirect behavior is tested.
6. Classify large binaries by owner and license before optimization, Git LFS,
   history changes, or repository extraction is considered.
7. Refresh this audit on the exact head of every migration PR.

## Validation contract for later batches

Every later migration PR must record its exact source paths, destination paths,
file count, byte count, exclusions, link behavior, and rollback. It must pass
the site verification suite, scan moved documents in report-only mode, and
prove that `dist/` contains no archive, studio, or unselected lab material.
