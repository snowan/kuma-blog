# Agent memory consolidation record

Date: 2026-08-20
Status: canonical drafts prepared; publication and legacy disposition pending

## Scope

This batch reviewed three high-overlap legacy sources and prepared three draft-only reader outcomes:

| Legacy source | Canonical draft | Reader outcome |
| --- | --- | --- |
| `AI/AI-article-analysis/memory-in-the-age-of-agent-survey.md` | `src/content/writing/memory-context/agent-memory-survey.mdx` | Critical research map and the series' only full Forms–Functions–Dynamics table |
| `AI/AI-article-analysis/ai-agent-memory/ai-agent-memory-deep-dive.md` | `src/content/writing/memory-context/agent-memory-deep-dive.mdx` | Correctable implementation architecture, lifecycle, and evaluation plan |
| `AI/AI-manga-learnings/memory-in-the-age-of-ai-agent/learning-series.md` | `src/content/visuals/memory-context/agent-memory-learning-series.mdx` | Original five-gate visual learning path |

The audit reported pairwise similarity of 0.780 between the legacy deep dive and visual learning series, and 0.736 between the legacy survey analysis and visual learning series. The overlap was concentrated in repeated taxonomy, definitions, and lifecycle exposition.

## Consolidation decisions

- The research survey owns the one canonical Forms–Functions–Dynamics comparison table.
- The practical guide links to that table and owns schemas, control boundaries, retrieval stages, correction, deletion, privacy, and held-out tests.
- The visual explainer owns a single worked example through an original five-gate illustration; it does not recreate the taxonomy.
- Product and benchmark results are attributed to their papers rather than presented as universal performance claims.
- Volatile vendor-stack rankings and an unsupported universal retrieval-weight formula from the legacy deep dive were not carried forward.
- The three drafts cross-link as the `memory-lab` series.

## Source refresh

Primary sources were checked on 2026-08-20:

- Hu et al., *Memory in the Age of AI Agents*, arXiv:2512.13564 (v2, 2026-01-13)
- Packer et al., *MemGPT*, arXiv:2310.08560
- Park et al., *Generative Agents*, arXiv:2304.03442
- Chhikara et al., *Mem0*, arXiv:2504.19413
- Wu et al., *LongMemEval-V2*, arXiv:2605.12493

The drafts distinguish the survey taxonomy from implementation recommendations and identify the cited papers as research evidence rather than guarantees.

## Protected state

- All three legacy source files remain untouched.
- No legacy route, asset, or repository directory moved.
- No redirect, archive, deletion, or publication is authorized by this record.
- The new entries remain `status: draft` and are included in the distribution leakage check.

## Remaining decisions

1. Review the three canonical drafts together for voice and reader separation.
2. Decide exact publication dates and routes in a separate approval batch.
3. After publication verification, separately review whether each legacy source should remain, redirect, or move to an archive.
