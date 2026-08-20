# Harness cluster consolidation record

Status: canonical drafts prepared; publication and legacy retirement are
pending explicit approval.

## Boundary

This record covers editorial review and draft preparation for the exact paths
below. It does not authorize publishing, moving, archiving, deleting, or
rewriting the legacy source files.

## Inputs and reader outcomes

| Legacy source | Reviewed role | Canonical outcome |
| --- | --- | --- |
| `AI-blogs/demystifying-agent-harness.md` | Broad concept and market survey | Concept article explaining the harness boundary and tradeoffs |
| `AI-blogs/how-to-build-agent-harness.md` | Implementation survey and staged guide | Minimal build guide centered on state, authority, evidence, and recovery |
| `AI-blogs/agent-harness-deep-dive.md` | High-overlap concept source with enterprise design principles | Unique material folded into the concept and guide; source retained |

The draft outputs are:

- `src/content/writing/agents-harnesses/demystifying-agent-harness.mdx`
- `src/content/writing/agents-harnesses/how-to-build-agent-harness.mdx`
- `src/content/visuals/agents-harnesses/agent-harness-control-loop.mdx`

All three use `status: draft`, so production routes, search, RSS, and the
sitemap exclude them.

## Material preserved

The canonical pair preserves and sharpens:

- the model versus harness responsibility boundary;
- a qualified framework, runtime, harness, and application taxonomy;
- context, tool, state, permission, evaluation, and recovery responsibilities;
- externalized durable state and append-only run history;
- infrastructure-enforced safety rather than prompt-only policy;
- a minimal tool loop with budgets and environment-based completion checks;
- the transcript-versus-outcome distinction;
- long-running handoff artifacts and model-change limitations;
- explicit failure, recovery, and human-escalation paths.

The visual explainer turns the common control-loop material into one original,
accessible diagram with a prose reading guide.

## Material intentionally not carried forward

The canonical drafts omit:

- product rankings and “top five” framing;
- revenue, acquisition, star, download, and adoption counts;
- universal performance targets or benchmark promises;
- broad market predictions and enterprise ROI claims;
- repeated product summaries that do not change the reader decision;
- quotations and secondary commentary that were not necessary to the argument.

These omissions reduce volatile claims and keep the two reader outcomes
distinct. The legacy files remain available for later redirect and retirement
review.

## Source refresh

Primary sources were rechecked on 2026-08-20:

- OpenAI, “Harness engineering”
- OpenAI, “Unlocking the Codex harness”
- Anthropic, “Effective harnesses for long-running agents”
- Anthropic, “Demystifying evals for AI agents”
- Anthropic, “Scaling Managed Agents”
- LangChain, “The anatomy of an agent harness”
- LangChain, “Agent frameworks, runtimes, and harnesses”

The drafts describe author synthesis as synthesis, avoid invented benchmarks,
and include limitations near the claims they qualify.

## Audit evidence

The refreshed repository audit evaluated 273 Markdown documents with 273
complete scans. The three harness inputs form an overlap cluster:

| Pair | Cosine similarity |
| --- | ---: |
| deep dive ↔ concept | 0.836 |
| concept ↔ build guide | 0.799 |
| deep dive ↔ build guide | 0.762 |

Scanner findings were used as editorial triage only. No deletion decision was
derived from an Unslop or readability score.

## Remaining decisions

- Explicitly approve or reject publication of the three draft outputs.
- Assess whether any legacy Markdown path has meaningful inbound links.
- Implement and test a static redirect only if a prior public route existed.
- Review the exact legacy deep-dive path in a separate retirement change.
- Do not remove any of the three legacy sources in this batch.
