# Codex Context Lab publication

- Date: 2026-09-06
- Base: `dad15ea1729cbcf41b93e02b3f0e78158125e638`
- Authorization: the user explicitly requested publication of the completed
  interactive HTML to Kuma Blog with AI, Agents, and Context compaction labels.

## Exact publication scope

- New published entry:
  `src/content/visuals/memory-context/codex-context-experiments.mdx`
- Blog route: `/kuma-blog/visuals/codex-context-experiments/`
- Interactive course: `/kuma-blog/learn/codex-context-experiments/`
- Public course assets: `public/learn/codex-context-experiments/`
- Original explanatory cover:
  `src/assets/articles/codex-context-experiments/context-continuity.svg`

The course retains seven lessons, autoplay/pause/replay, exercises, local
progress, and teach-back export. Public source notes contain citations and
synthetic teaching examples. Internal browser logs and local workspace paths
are excluded from the published artifact.

The existing context-engineering and agent-memory articles cover wider design
questions; this course explains a fixed public Codex experimental implementation.
The introduction cross-links those broader articles. No legacy article is
moved, deleted, archived, or reclassified.

## Discovery

- Exact labels: `AI`, `Agents`, `Context compaction`.
- Linked tag pages normalize case, so `agents` and `Agents` share one route.
- The homepage's visual-learning section, Visuals, Memory and Context, and
  complete library link to the introduction.
- Pagefind indexes the static introduction, including English terminology,
  Chinese learning content, and tags. The dynamic lesson links back to it.
- Both routes have canonical URLs; the course has sharing and LearningResource
  metadata. The introduction enters RSS, and both routes enter the sitemap.
- Tags are generated only from published entries; draft fixtures stay excluded.

## Verification and rollback

Local checks on the publication copy:

- Locked dependency install; `pnpm verify` passed, including Astro diagnostics,
  contrast checks, Pagefind, generated-link/canonical checks, and a second
  production build with the draft-preview flag deliberately enabled.
- `pnpm audit --prod` reported no known vulnerabilities.
- `node --check` passed for the course script; `git diff --check` passed.
- In-app browser: the `Codex context` search put the course first;
  `Context compaction` search included it; the complete-library filter showed
  exactly this course for `Context compaction`.
- Keyboard Enter on the course's Context compaction tag opened the tag page.
- Course single-step, play, pause, and replay worked under `/kuma-blog/`.
- Home, introduction, and course had no horizontal overflow at 390 and
  1440 CSS pixels. The introduction, course, search, tag, and filtered-library
  views also passed at 320 pixels. All three course presentations passed at
  320, 390, and 1440 pixels. Browser console had no warnings or errors.
- Reviewed the original SVG and article CTA in the built page.
- Reduced-motion rules and the no-JavaScript fallback were inspected in the
  source; OS-level motion emulation was not part of this browser pass.

After merge, require Site CI and GitHub Pages deployment for the merge SHA,
then verify hosted routes, feeds, search, and a known draft 404. Local checks
alone do not establish deployment or external search-engine indexing.

Revert the publication commit to remove this entry and its discovery changes.
The original local learning draft remains independent of the publication copy.

## Architecture overview update

The user requested an additional overview page explaining the whole mechanism
through architecture diagrams and flows. The update adds
`public/learn/codex-context-experiments/overview.html` with its dedicated CSS and
JavaScript, linked from the course navigation and published introduction, and
included in the sitemap. The local learning copy has the same overview assets.

Seven selectable components explain the model, working context, harness,
history-notes extension, notes, history, and environment. A six-step flow
compares normal recovery, missing notes, and delayed search visibility. The
overview self-check does not contribute to the seven existing lesson scores.
All mechanism claims retain the fixed source version and evidence boundaries.

Validation: `pnpm verify` passed (495 generated files), followed by a successful
build, generated-site verification, and script syntax check after the mobile
inline-detail refinement. Browser checks covered all seven node explanations
and source links, three recovery scenarios, single-step, pause, replay, automatic
stop at step six, correct and incorrect feedback, keyboard activation, and the
preserved 1/7 score after a course-overview-course round trip. All three themes
at 320, 390, and 1440 CSS pixels had no horizontal overflow; console warnings
and errors were empty. Reduced-motion handling was checked in source only.
