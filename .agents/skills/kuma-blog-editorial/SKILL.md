---
name: kuma-blog-editorial
description: Plan, draft, consolidate, or review Kuma Blog writing about AI, agents, harnesses, memory, evals, and reliability. Use for editorial work and overlap triage; do not use for site styling or deployment.
---

# Kuma Blog editorial

Produce source-grounded writing with a clear reader benefit and a recognizable
personal engineering voice.

## Frame the work

Identify whether the task is a new article, a factual refresh, an experiment
report, or a consolidation of overlapping posts. Search the repository for
related claims and titles before drafting.

When overlap is substantial, propose one canonical article, list the unique
evidence worth preserving from each candidate, and keep deletion or archival as
a separately approved action.

## Build the article

Start from a specific question, claim, system problem, or tested outcome. Make
the distinction between sourced fact, direct observation, inference, and
opinion visible to the reader.

Use the structure that fits the content:

- **Research essay:** question, thesis, evidence, counterpoint or limitation,
  implications, sources.
- **Technical guide:** outcome, prerequisites, system map, implementation,
  evaluation, failures, checklist, sources.
- **Experiment report:** hypothesis, setup, method, observations, results,
  limitations, next test, sources.
- **Field note:** context, what changed in the author's understanding, concrete
  example, unresolved questions, references.

Prefer primary technical sources and link them near the supported claims. Never
invent citations, quotations, benchmarks, production experience, or test
results. Include environment and limitations when reporting technical work.

## Edit in the right order

1. Correct facts, scope, and certainty.
2. Improve the argument and evidence.
3. Remove repetition and templated structure.
4. Tighten sentences while preserving the author's voice.
5. Check links, figures, captions, metadata, and sources.

Automated Unslop or readability findings are triage cues, not AI-authorship
scores. Review every finding in context and never optimize for detector evasion.

For broad audits or reorganization proposals, use the workflow and guardrails
in [`AGENTS.md`](../../../AGENTS.md). For article presentation, route through
the approved design guide rather than inventing new styling.
