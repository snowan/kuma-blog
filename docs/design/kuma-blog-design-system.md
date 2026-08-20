# Kuma Blog design system

Status: approved and implemented in the Astro site shell. Canonical content
migration and GitHub Pages cutover remain separate reviewed changes.

## Decision

Kuma Blog uses one publishing system with three related presentations:

1. **Paper Journal** is the default site shell and long-form reading experience.
2. **Control Room** is the technical mode for guides, experiments, traces,
   evaluations, and runbooks.
3. **Mori Notebook** is the warmer narrative mode for personal field notes and
   illustrated essays.

The presentations are not separate websites. They share navigation, URLs,
metadata, semantic components, accessibility behavior, and content hierarchy.
Only the visual tone and a small set of content components change.

Review the approved interactive reference:
[Kuma Blog Top Three.html](../../designs/kuma-blog-top-three/Kuma%20Blog%20Top%20Three.html).
The built site also exposes noindex review routes at `/design-system/journal/`,
`/design-system/control/`, and `/design-system/mori/`.

## Brand position

Kuma Blog is an engineer's field journal about reliable AI systems. It should
feel thoughtful, precise, personal, and visually literate—not like a generic
theme installation, an AI-generated content farm, or a simulated operations
dashboard.

The site should make these topics easy to recognize:

- Agents and harnesses
- Memory and context
- Evals and reliability
- Inference systems
- Field notes and visual explainers

## Shared content contract

### Homepage

Use the same homepage anatomy in every presentation:

1. Compact masthead with Writing, Topics, Lab Notes, Visuals, About, and Search
2. A clear position statement: “Field notes on reliable AI systems”
3. One featured article with a real system diagram or meaningful visual
4. Topic entry points for the four primary technical areas
5. Latest writing as an editorial list rather than a dense card wall
6. One visual-explainer feature
7. Current research threads or questions
8. RSS, GitHub, methodology, and archive links in the footer

### Article

Every published article should support:

- Breadcrumb and content type
- Title and concise description
- Published date, updated date, reading time, and last-verified date where useful
- Optional series navigation
- Optional key-points summary
- Article body with headings and deep links
- Wide figures that can break out of the reading column
- Captions and alt text for meaningful visuals
- Sources and revision history
- Related and previous/next articles

The table of contents may remain visible on wide screens. On narrow screens it
must collapse into the document flow rather than becoming a permanent sidebar.

## Presentation routing

Choose presentation from the article's purpose, not from personal taste.

| Presentation | Use for | Avoid |
| --- | --- | --- |
| Paper Journal | Research essays, explainers, reviews, canonical articles, indexes | Turning every page into a decorative magazine spread |
| Control Room | Implementation guides, experiments, eval reports, traces, runbooks | Fake telemetry, glowing decoration without meaning, terminal cosplay |
| Mori Notebook | Personal field notes, learning journeys, illustrated essays | Imitating recognizable films, characters, scenes, or another artist's style |

Paper Journal remains the fallback whenever a document does not clearly need a
specialized presentation.

## Visual tokens

These values are the approved starting point. Production tokens may be adjusted
for tested contrast, self-hosted font metrics, or platform rendering, but their
relationships should remain recognizable.

| Token | Paper Journal | Control Room | Mori Notebook |
| --- | --- | --- | --- |
| Background | `#f3f0e8` | `#06100e` | `#f7f3df` |
| Surface | `#fffdf7` | `#0a1714` | `#fffdf0` |
| Soft surface | `#e8e3d8` | `#0b1d19` | `#dcebd7` |
| Ink | `#172335` | `#e9fff4` | `#29423c` |
| Muted ink | `#657084` | `#91aa9e` | `#62776c` |
| Border | `#d2cab9` | `#1b4238` | `#b6c9ad` |
| Primary | `#194fb7` | `#68ffb5` | `#2e7a64` |
| Secondary | `#d75a33` | `#57cfff` | `#d76c49` |
| Display | Newsreader or restrained editorial serif | Manrope or clear geometric sans | Shippori Mincho or restrained Mincho serif |
| Body | DM Sans or high-quality system sans | Manrope or high-quality system sans | DM Sans or high-quality system sans |
| Code and metadata | IBM Plex Mono or system monospace | IBM Plex Mono or system monospace | IBM Plex Mono or system monospace |

Self-host production fonts when licensing permits and define strong system-font
fallbacks. The approved HTML prototype may use hosted fonts for review only.

## Presentation character

### Paper Journal

- Warm paper and white sheet surfaces
- Editorial serif headlines and article copy
- Precise blue annotations with restrained orange accents
- Fine rules, small metadata, minimal rounding, and real diagrams
- Calm rhythm with generous whitespace

### Control Room

- Near-black green background with high-contrast mint ink
- Monospace metadata, square geometry, grids, and trace-like callouts
- Cyan as a secondary technical signal
- Real experiment state, evaluation results, or architecture data only
- Sans-serif body copy for long-form readability

### Mori Notebook

- Warm paper, quiet greens, sunrise gold, and clay accents
- Mincho-style display typography with accessible sans-serif support copy
- Organic corners and small original landscape motifs
- Hand-drawn or paper-like visual details used sparingly
- An original Japanese-inspired field-journal mood without copying protected
  characters, settings, or a specific studio's trade dress

## Typography and reading

- Limit normal article copy to `72ch`; never exceed `80ch`.
- Use a body line height around `1.6` to `1.7`.
- Keep paragraphs left aligned; do not justify long-form text.
- Establish a strong but compact heading hierarchy.
- Keep code, captions, dates, and labels visually distinct without making them
  too small to read.
- Let diagrams and selected images exceed the text measure when doing so makes
  relationships clearer.

## Components

Build semantic components once, then skin them with presentation tokens:

- `SiteHeader`, `SiteFooter`, and `Search`
- `ArticleHeader`, `ArticleMeta`, `SeriesNav`, and `TableOfContents`
- `KeyPoints`, `EvidenceNote`, `Callout`, and `RevisionHistory`
- `SystemDiagram`, `Figure`, `Caption`, and `CodeBlock`
- `TopicCard`, `ArticleRow`, `FeaturedArticle`, and `RelatedArticles`

Do not fork markup or content models merely to change color, typography, or
surface treatment.

## Accessibility and behavior

- Meet WCAG AA contrast for text and interactive states.
- Support keyboard navigation and obvious visible focus.
- Provide meaningful alt text; use empty alt text only for decorative images.
- Include captions when a figure's relevance is not obvious from surrounding
  text.
- Make code blocks, tables, diagrams, and long URLs work at narrow widths.
- Avoid horizontal page scrolling at a 320 px viewport.
- Honor `prefers-reduced-motion` and do not require motion to understand state.
- Do not rely on color alone to communicate meaning.
- Keep hover effects supplementary; every action must work with touch and
  keyboard input.

## Proposed content metadata

The future static site should support a presentation field without coupling
content to a specific component implementation:

```yaml
---
title: "How to Build an Agent Harness"
description: "A practical guide to control loops, tools, state, and recovery."
publishedAt: 2026-03-22
updatedAt: 2026-08-18
lastVerified: 2026-08-18
status: published
type: guide
presentation: control
topic: agents-harnesses
series: harness-lab
tags: [agents, harnesses, evaluation]
featured: true
---
```

Allowed presentation values should be `journal`, `control`, and `mori`.
Omitting the field selects `journal`.

## GitHub Pages implementation boundary

The approved implementation direction is a custom static Astro site informed
by AstroPaper's content, accessibility, and publishing architecture—not its
visual identity. The project site must work under `/kuma-blog/`, and GitHub
Pages should deploy only the generated static output.

The Astro content model and shared presentation components are implemented.
Content migration and the GitHub Pages deployment workflow still require their
own reviewed changes; the noindex design routes are review fixtures, not
published articles.

## Review checklist

Before approving a visual change, confirm:

- The presentation matches the content purpose.
- Shared navigation, metadata, and article semantics remain intact.
- Paper Journal still works as the default.
- The homepage and representative article work at desktop and mobile widths.
- Type measure, line height, contrast, focus, overflow, alt text, and captions
  satisfy the shared rules.
- Decorative styling does not imply nonexistent data or behavior.
- The result still feels like one Kuma Blog family.
