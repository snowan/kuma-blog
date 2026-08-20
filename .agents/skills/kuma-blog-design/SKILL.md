---
name: kuma-blog-design
description: Apply or review the approved Kuma Blog design system for site layouts, article templates, components, and visual prototypes. Use for visual or front-end work; do not use for prose-only editing.
---

# Kuma Blog design

Create a coherent, accessible Kuma Blog experience using the approved
three-presentation system.

## Start here

Read [`docs/design/kuma-blog-design-system.md`](../../../docs/design/kuma-blog-design-system.md)
before making design decisions. Inspect the approved interactive HTML only when
you need exact visual behavior or token context.

## Choose the presentation

- Use **Paper Journal** by default and for research essays or canonical posts.
- Use **Control Room** for technical guides, experiments, evals, traces, and
  runbooks.
- Use **Mori Notebook** for personal field notes and illustrated essays.

If the content purpose is unclear, keep Paper Journal and ask for review rather
than inventing a fourth visual system.

## Preserve the shared system

Keep navigation, metadata, content schema, semantic markup, accessibility, and
URL behavior identical across presentations. Implement shared components once
and vary them through tokens and narrowly scoped presentation styles.

Do not introduce fake telemetry, ornamental controls, inaccessible terminal
effects, or a recognizable imitation of another artist or animation studio.

## Validate

Review both the homepage and a representative article in all three
presentations. Check desktop and 320–360 px widths, keyboard focus, reduced
motion, contrast, text measure, overflow, diagrams, captions, and alt text.
Report what was actually verified and what remains untested.
