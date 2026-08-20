# Evals and inference consolidation record

Date: 2026-08-20
Status: canonical drafts prepared; publication and legacy disposition pending

## Inputs and outcomes

| Legacy source | Canonical draft | Decision |
| --- | --- | --- |
| `AI/ai-resources/evals/anthropic-demisfy-ai-evals.md` | `src/content/writing/evals-reliability/agent-evals-that-diagnose-failure.mdx` | Replace the secondary summary with an outcome-first implementation guide refreshed from Anthropic's primary reports |
| `AI-blogs/ai-inference-batching-explained.md` | `src/content/writing/inference-systems/llm-serving-control-plane.mdx` | Preserve the batching progression while attributing benchmark results and removing universal utilization claims |
| `AI-blogs/design-chatgpt-ai-inference-platform.md` | `src/content/writing/inference-systems/llm-serving-control-plane.mdx` | Retain scheduler, KV-cache, latency, failure, and disaggregation concepts; exclude fabricated scale and unsupported company claims |
| `AI-blogs/dynamic-rate-limiting-ai-inference.md` | `src/content/writing/inference-systems/llm-admission-control.mdx` | Replace fixed health multipliers and VIP shedding with quota, reservation, live pressure, fair queuing, and recovery contracts |

The content audit found no pair among these inputs above the 0.72 similarity threshold. Consolidation is based on reader outcome and claim ownership rather than duplicate detection.

## Primary-source refresh

Checked on 2026-08-20:

- Anthropic, *Demystifying evals for AI agents* (2026-01-09)
- Anthropic, *Quantifying infrastructure noise in agentic coding evals* (2026-02-05)
- Yu et al., *Orca*, OSDI 2022
- Kwon et al., *Efficient Memory Management for LLM Serving with PagedAttention*, SOSP 2023
- Zhong et al., *DistServe*, arXiv:2401.09670
- Agrawal et al., *Sarathi-Serve*, arXiv:2403.02310
- current vLLM production metrics documentation
- current NVIDIA Triton batcher documentation
- current Envoy overload-manager documentation
- Anthropic API rate-limit guidance updated 2026-06-26

## Material not carried forward

- invented or unattributed ChatGPT scale, fleet size, SLO, database, and architecture claims;
- fixed GPU utilization and latency percentages presented without a reproducible environment;
- benchmark multipliers generalized beyond the paper's models, hardware, traces, and baselines;
- “RPM is dead” and “continuous batching is essential” as universal claims;
- hard-coded green/yellow/red resource thresholds and entitlement-based random shedding;
- volatile framework configuration snippets that were not tested in this repository.

## Protected state

- All four legacy files and their image resources remain untouched.
- The three new articles remain `status: draft`.
- Distribution verification rejects their routes, slugs, RSS entries, and sitemap entries.
- No move, deletion, redirect, archive, or publication is authorized here.

## Remaining decisions

1. Review the eval guide and two inference articles as one reliability thread.
2. Decide publication order, dates, and routes in a separate approval batch.
3. After publication, review legacy disposition with redirects and unique-material evidence.
