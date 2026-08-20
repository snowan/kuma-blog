# Kuma Blog research and writing roadmap

The editorial focus is reliable AI systems: what makes agents observable,
recoverable, permissioned, and useful after the model call. Prefer original
experiments and durable system explanations over broad AI-news summaries.

## Recommended publishing mix

Use a sustainable monthly cadence:

- one source-grounded research essay;
- one or two compact lab notes from a controlled experiment;
- one visual explainer derived from the strongest essay or experiment;
- one monthly source-ledger refresh instead of a generic news roundup.

The 11 existing canonical drafts are the first review queue. Publish them in
small, explicitly approved batches rather than all at once.

## Top three new research threads

### 1. Recovery is the harness feature that changes outcomes

Run the same tasks with the same model under three conditions: no recovery,
bounded retry, and checkpoint-plus-handoff. Score both final-message claims and
environment state. Report retry cost, repeated failures, human intervention,
and cases where recovery makes the result worse.

Outputs:

- Control Room lab note with the task set and outcome rubric;
- Paper Journal essay on recovery as a control-plane responsibility;
- visual state machine for fail, retry, checkpoint, escalate, and stop.

### 2. Memory needs provenance and freshness, not only retrieval

Build a synthetic memory corpus with known timestamps, conflicts, and source
quality. Compare retrieval-only answers with answers produced under freshness,
provenance, and conflict policies. Measure whether the agent cites the right
memory and whether stale context changes the task outcome.

Outputs:

- memory-eval lab note and reusable synthetic fixture;
- essay connecting storage, retrieval, conflict resolution, and forgetting;
- visual showing the five gates from capture to governed use.

### 3. Tool authorization belongs outside the prompt

Create a harmless file-and-API task set with explicit allow, deny, approval,
budget, and timeout rules. Compare prompt-only instructions with
infrastructure-enforced permissions. Record attempted violations, ambiguous
requests, escalation quality, and environment results.

Outputs:

- lab note with the authorization matrix;
- implementation guide for tool contracts and policy checks;
- visual request flow from user intent to tool result and audit record.

## Follow-on queue

1. Context-budget failure curves: what gets lost as context fills, and which
   compaction strategies preserve task-critical state?
2. Agent eval noise: how harness state, tools, latency, and infrastructure make
   repeated trials disagree.
3. Long-running handoffs: which artifacts let a fresh process continue without
   replaying the entire transcript?
4. Trace usefulness: which events help diagnose failure without exposing hidden
   reasoning or raw private tool output?
5. Admission control for agent workloads: how rate limits, queues, and budgets
   should react to long, tool-heavy runs.
6. Harness portability: what breaks when the same workflow changes models,
   runtimes, or tool providers?

## Source strategy

Start with primary documentation, specifications, repositories, and papers.
Record the exact claim each source supports and the verification date. Use
secondary commentary to discover questions, not as sole support for changing
technical claims. When a source is unavailable or coverage is degraded, say so.

Before drafting, search the legacy repository and `src/content/` for overlap.
Choose a new article only when it has a distinct reader outcome; otherwise add
evidence to the existing canonical draft or create a linked lab note.

