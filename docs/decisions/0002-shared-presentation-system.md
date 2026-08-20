# ADR 0002: Use one site with three presentation modes

- Status: accepted
- Date: 2026-08-20
- Scope: content and presentation contract

## Context

Kuma Blog needs a consistent identity while supporting precise research essays,
technical experiment reports, and warmer illustrated field notes. Separate
themes or sites would fragment navigation, metadata, accessibility, URLs, and
maintenance.

## Decision

Use one publishing system with three presentations:

- Paper Journal (`journal`) is the default for canonical writing and indexes.
- Control Room (`control`) is for guides, experiments, evals, traces, and
  runbooks.
- Mori Notebook (`mori`) is for personal field notes and illustrated essays.

The modes share content schemas, navigation, semantic components, URL behavior,
search, and accessibility. Presentation changes tokens and a narrow set of
content components only.

## Consequences

- A document selects presentation according to purpose rather than preference.
- Components are implemented once and skinned through tokens.
- Paper Journal is the fallback for ambiguous content.
- Japanese-inspired work must remain original and must not imitate protected
  characters, settings, compositions, or another studio's trade dress.
- Control Room cannot use fabricated telemetry, terminal output, or controls.

## Guardrail

This record approves the shared contract, not a production visual
implementation. Production work must follow the design-system review checklist.
