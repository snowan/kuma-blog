# Context-engineering consolidation record

Status: two differentiated canonical drafts prepared; publication and legacy
retirement are pending explicit approval.

## Boundary

This record covers editorial review and draft preparation for the exact paths
below. It does not authorize publishing, moving, archiving, deleting, or
rewriting the legacy source files.

## Inputs and reader outcomes

| Legacy source | Reviewed role | Canonical outcome |
| --- | --- | --- |
| `AI/ai-resources/context-engineering/context-engineering.md` | Broad resource map with definitions, papers, product reports, and patterns | Decision-oriented concept article covering context classes, selection strategies, failures, and evaluation |
| `AI/ai-resources/context-engineering/context-engineering-with-file-system.md` | Filesystem-focused collection with repeated context setup | Implementation guide for governed artifacts, progressive retrieval, restorable compaction, and clean-session handoff |

The draft outputs are:

- `src/content/writing/memory-context/context-engineering.mdx`
- `src/content/writing/memory-context/filesystem-context-engineering.mdx`

Both use `status: draft`, so production routes, search, RSS, and the sitemap
exclude them. `tools/site/verify-dist.mjs` asserts that the two slugs do not
leak into generated output or discovery feeds.

## Differentiation decision

The concept article answers: **How should an agent system decide what enters a
model call?** It defines context as a runtime view over durable state, presents
selection strategies, and proposes task-level evaluation.

The filesystem guide answers: **How should a long-running agent persist and
recover context artifacts?** It defines artifact classes, a minimal workspace,
provenance metadata, progressive retrieval, reversible compaction, and a
clean-session handoff test.

Shared definitions and generic motivation appear in the concept article only.
The implementation guide links back instead of repeating the resource survey.

## Material preserved

- Anthropic's finite-attention and just-in-time retrieval framing;
- LangChain's write, select, compress, and isolate operations;
- Manus's restorable filesystem context and stable-prefix observations;
- the distinction between active context and durable state;
- file and directory metadata as retrieval signals;
- source provenance, freshness, access scope, and human inspectability;
- context compaction, long-task progress artifacts, and clean handoff;
- primary industry reports and relevant research preprints.

## Material intentionally not carried forward

- “top 30” ranking, star ratings, and “definitive” claims;
- viral-discussion and popularity framing;
- product or framework listings that do not change a design decision;
- screenshots copied from third-party sources;
- precise vendor price examples and other volatile numbers;
- a chronology that implied convergence without comparative evidence;
- claims that filesystems are universally better than other storage systems.

The two legacy sources remain untouched so any omitted entry can be reviewed
before a later retirement decision.

## Source refresh

Primary sources were rechecked on 2026-08-20:

- Anthropic, “Effective context engineering for AI agents”
- Anthropic, “Harness design for long-running application development”
- Manus, “Context Engineering for AI Agents: Lessons from Building Manus”
- LangChain, “Context Engineering for Agents”
- LangChain, “How agents can use filesystems for context engineering”
- Xu et al., “Everything is Context: Agentic File System Abstraction for
  Context Engineering”
- McMillan, “Structured Context Engineering for File-Native Agentic Systems”

The two academic sources are described as preprints. Product-specific reports
are qualified as observations from those systems, not universal performance
claims.

## Audit and presentation evidence

The repository-wide Unslop-backed audit completed 273 of 273 Markdown scans.
It identified the two legacy context sources as an overlap pair with cosine
similarity 0.757, supporting differentiation review rather than deletion.

Direct scans of both MDX drafts reported zero hard or soft banned phrases.
Readability and silhouette findings were reviewed as advisory signals. No
concrete span met the Unslop contract's threshold for an edit; MDX imports,
links, tables, code, and intentionally navigable technical headings skew the
raw metrics.

A local-only review build rendered both drafts without publishing them:

- the concept uses Paper Journal and the guide uses Control Room;
- both have functional tables of contents and zero console errors or warnings;
- desktop layouts have no horizontal overflow;
- both report exactly 320 px document width in a 320 px viewport.

The files were restored to `status: draft` before the authoritative build.

## Remaining decisions

- Explicitly approve or reject publication of each draft route.
- Assess whether either legacy Markdown path has meaningful inbound links.
- Implement and test redirects only if a prior public route existed.
- Review exact legacy retirement targets in a separate change.
- Do not remove either source in this batch.
