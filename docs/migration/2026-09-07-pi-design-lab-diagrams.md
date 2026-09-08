# Pi Design Lab · visual pass

Follow-up to `2026-09-07-pi-design-lab-publication.md`. The lesson already had ten
steppable flows, but every picture in them was built from bordered boxes and arrow
glyphs. Five relationships that the course argues about were therefore only stated
in prose. This change draws them.

No claim, source, threshold or dataset projection changed. The teaching models are
the same functions; the new code reads them and lays them out.

## What was added

- **Session tree (04)** — `src/content/…` unchanged; in `public/learn/pi-design-lab/index.html`
  the `#tree-picker` box stack is replaced by an SVG tree with drawn edges. Shared
  ancestor, target path and the path being left are three distinct colours instead
  of three identical boxes. Leaves are clickable in the picture; the three real
  buttons stay underneath and remain the accessible control.
- **Prefix bar (02)** — two bars on one axis: how much text still matches, and how
  much computation is actually skipped. They are drawn separately because they come
  apart: with a matching prefix and an unreachable cache, bar one is full and bar
  two is empty. That was the section's main point and previously only a number.
- **Context shape (03)** — pre- and post-compaction input drawn on one token axis
  with the automatic threshold marked. At the smallest window with the largest
  keepRecent the illustration saves nothing, and the caption says so rather than
  implying compaction always shortens.
- **Recovery timeline (06)** — the four durable checkpoints as a timeline, with the
  crash position and, when the effect is unknown, the shaded window between a
  submitted intent and a committed result.
- **Session structure strip (07)** — one tick per entry, coloured by kind, so a
  495-row file has a shape before it is scrolled: the compaction at L343 and the
  fork in sample C are visible at a glance. Clicking the strip inspects that row;
  the entry list remains the accessible path.

Flows also step from the keyboard now (← → single step, Space play/pause) while
focus is inside them; inputs and selects keep their own key handling.

Diagrams are theme-aware through the existing custom properties, carry a title and
a description, and contain no animation. On narrow screens a labelled diagram
scrolls inside its own container rather than shrinking its text; the strip, which
has no inline labels, scales.

## Validation

- `pnpm verify` passed: 3,324 assertions (was 1,915), manifest, Astro/type checks,
  contrast, build, Pagefind, generated link and canonical checks, and the
  production draft-exclusion build. 504 generated files passed.
- New assertions cover tree node/edge roles and in-frame layout for all three
  targets, the two prefix bars spanning the input for all seven change scenarios
  in both cache states, the shape model against the budget model across the full
  slider ranges, timeline replay counts against the recovery model, and map
  categories against each sample's counted statistics.
- Browser pass over all nine lessons at 320 / 390 / 650 / 800 / 1280px: no
  horizontal overflow at any width, no console errors. Checked in Control Room,
  Paper Journal and Mori Notebook.
- Not verified: screen readers, other browser engines, and whether the diagram
  title/desc read usefully through assistive technology.
