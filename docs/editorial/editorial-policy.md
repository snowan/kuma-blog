# Kuma Blog editorial policy

Status: approved governance for future content work. This document does not
approve moving, merging, archiving, deleting, or publishing any existing file.

## Editorial purpose

Kuma Blog is an engineer's field journal about reliable AI systems. The public
site prioritizes original, source-grounded work about:

- Agents and harnesses
- Memory and context
- Evals and reliability
- Inference systems
- Field notes and visual explainers that support those topics

The repository may contain broader learning notes and historical material, but
repository presence alone does not make a document a published article.

## Reader promise

Every published article should help a reader answer a concrete question, make
a technical decision, reproduce an observation, or understand how the author's
view changed. Publication quality is determined by reader value, evidence, and
clarity rather than content volume or an automated prose score.

## Content types

Use the form that best matches the work:

### Research essay

Structure around a question, thesis, evidence, counterpoint or limitation,
implications, and sources. Distinguish the author's synthesis from claims made
by sources.

### Technical guide

State the outcome and prerequisites, show the system map, explain the
implementation, report validation and failure modes, and end with a practical
checklist and sources.

### Experiment report

Record the hypothesis, environment, task set, controlled variables, method,
observations, results, limitations, and next test. Link a privacy-safe,
inspectable artifact when possible.

### Field note

Explain the context, what changed in the author's understanding, one concrete
example, unresolved questions, and relevant references. A field note can be
short, but it should not be generic commentary.

### Visual explainer

Make one difficult relationship easier to understand. Publish the final visual,
accessible alternative text, a caption or reading guide, and a concise source
or method note. Prompts, storyboards, character sheets, and generated
intermediates belong in the studio layer rather than the public article feed.

## Evidence and claims

Published work must make the following distinctions clear:

- **Sourced fact:** supported by a cited external source.
- **Direct observation:** observed in a stated environment or experiment.
- **Inference:** the author's interpretation of facts or observations.
- **Opinion:** a judgment or preference that is presented as such.

Prefer primary technical sources for technical claims. Place citations near the
claims they support and include a concise sources section. Never invent a
citation, quotation, benchmark, experiment, production result, or personal
experience.

For changing facts, include `lastVerified` and recheck the claim before making a
material update. If a source is unavailable or research coverage is degraded,
say so rather than silently implying complete coverage.

## Experiments and reproducibility

An experiment report must identify:

- The question or hypothesis
- Model, version, harness, tools, environment, and relevant configuration
- Variables held constant and variables intentionally changed
- Task selection and scoring method
- Raw observations and derived metrics
- Human interventions and failure recovery
- Limitations, confounders, and known missing evidence
- A next test that could disprove or refine the conclusion

Do not publish secrets, private conversations, hidden reasoning, credentials,
raw internal tool output, or identifying data. Redact or replace private inputs
with a public synthetic case before publication.

## Structure and voice

Lead with a specific reader problem, claim, experiment, or decision. Preserve
the author's voice and prefer concrete language over a uniform template.

Edit in this order:

1. Correct facts, scope, and certainty.
2. Strengthen the argument and evidence.
3. Remove repetition and duplicated setup.
4. Tighten sentences without flattening the author's voice.
5. Check metadata, links, figures, captions, and sources.

Automated Unslop and readability findings are triage cues. Review each finding
in context; never treat a score as proof of authorship or a deletion verdict,
and never edit merely to evade a detector.

## Overlap and canonical articles

Search for related titles and claims before drafting a new article. When
substantial overlap exists:

1. Name the intended reader outcome for each article.
2. Select a canonical article when the outcomes are the same.
3. Inventory unique evidence, examples, diagrams, and decisions in every
   candidate.
4. Merge only material that improves the canonical article.
5. Add scope statements and cross-links when related articles have distinct
   purposes.
6. Treat redirects, archival, and deletion as separate reviewed actions.

Similarity alone is not sufficient reason to consolidate translations,
related algorithm problems, sequels, or different experimental conditions.

## Content lifecycle

Use the following lifecycle:

```text
idea
  -> studio research or draft
  -> editorial review
  -> published content collection
  -> factual verification and revision
  -> archive or redirect after approval
```

- `studio/` contains non-sensitive drafts, source notes, prompts, storyboards,
  and intermediates. It is excluded from the website but remains visible in the
  public GitHub repository.
- `src/content/` contains only reviewed reader-facing documents.
- `labs/` contains reproducible, privacy-safe evidence and code that may be
  linked from published work.
- `archive/` preserves legacy material outside the main feed and deployment.

Moving a file between these areas requires a reviewed migration entry. Deleting
or retiring content requires explicit approval for the exact path.

## Required published metadata

Every published document must provide:

```yaml
title: "A specific article title"
description: "A concise statement of reader value."
publishedAt: 2026-08-20
updatedAt: 2026-08-20
status: published
type: essay
presentation: journal
topic: agents-harnesses
tags: [agents, harnesses]
featured: false
```

Add `lastVerified` when factual freshness matters. Add `series`, `canonicalUrl`,
and `cover` only when applicable. Use one `status` field with the allowed values
`draft`, `published`, and `archived`; do not add a redundant `draft` boolean.

Allowed content types are `essay`, `guide`, `experiment`, `field-note`, and
`visual-explainer`. Allowed presentations are `journal`, `control`, and `mori`.
Paper Journal (`journal`) is the default.

## Presentation routing

Presentation follows purpose:

- Paper Journal for research essays, canonical explainers, reviews, and indexes
- Control Room for implementation guides, experiments, evals, traces, and
  runbooks
- Mori Notebook for personal field notes, learning journeys, and illustrated
  essays

All presentations use the same semantic article structure, metadata,
navigation, accessibility behavior, and URL rules. Styling must not imply fake
telemetry, results, or functionality.

## Publication checklist

Before a document enters the public collection, confirm:

- The reader question and intended outcome are explicit.
- Claims are labeled by evidence type and supported at the right certainty.
- Primary sources are used where practical and links resolve.
- Experiments report environment, limitations, and failures.
- The document has a distinct purpose relative to existing articles.
- Metadata passes the content schema.
- Images have useful alternative text and captions where needed.
- No private data, secrets, or internal-only artifacts are present.
- Dates and `lastVerified` reflect what was actually checked.
- The selected presentation matches the document's purpose.

Publishing and deployment remain separate actions and require explicit
authorization.
