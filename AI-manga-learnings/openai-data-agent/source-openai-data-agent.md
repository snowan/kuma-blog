# Inside OpenAI’s in-house data agent

**January 29, 2026 | Engineering**
**By Bonnie Xu, Aravind Suresh, and Emma Tang**

Data powers how systems learn, products evolve, and how companies make choices. But getting answers quickly, correctly, and with the right context is often harder than it should be. To make this easier as OpenAI scales, we built our own bespoke in-house AI data agent that explores and reasons over our own platform.

Our agent is a custom internal-only tool (not an external offering), built specifically around OpenAI’s data, permissions, and workflows. We’re showing how we built and use it to help surface examples of the real, impactful ways AI can support day-to-day work across our teams. The OpenAI tools we used to build and run it (Codex, our GPT‑5 flagship model, the Evals API, and the Embeddings API) are the same tools we make available to developers everywhere.

Our data agent lets employees go from question to insight in minutes, not days. This lowers the bar to pulling data and nuanced analysis across all functions, not just by our data team. Today, teams across Engineering, Data Science, Go-To-Market, Finance, and Research at OpenAI lean on the agent to answer high-impact data questions. For example, it can help answer how to evaluate launches and understand business health, all through the intuitive format of natural language. The agent combines Codex-powered table-level knowledge with product and organizational context. Its continuously learning memory system means it also improves with every turn.

In this post, we’ll break down why we needed a bespoke AI data agent, what makes its code-enriched data context and self-learning so useful, and lessons we learned along the way.

## Why we needed a custom tool

OpenAI’s data platform serves more than 3.5k internal users working across Engineering, Product, and Research, spanning over 600 petabytes of data across 70k datasets. At that size, simply finding the right table can be one of the most time-consuming parts of doing analysis.

Analysts must reason about table data and table relationships to ensure transformations and filters are applied correctly. Common failure modes—many-to-many joins, filter pushdown errors, and unhandled nulls—can silently invalidate results. At OpenAI’s scale, analysts should not have to sink time into debugging SQL semantics or query performance: their focus should be on defining metrics, validating assumptions, and making data-driven decisions.

## How it works

Our agent is powered by GPT‑5.2 and is designed to reason over OpenAI’s data platform. It’s available wherever employees already work: as a Slack agent, through a web interface, inside IDEs, in the Codex CLI via MCP, and directly in OpenAI’s internal ChatGPT app through a MCP connector.

Users can ask complex, open-ended questions which would typically require multiple rounds of manual exploration. The agent handles the analysis end-to-end, from understanding the question to exploring the data, running queries, and synthesizing findings.

Rather than following a fixed script, the agent evaluates its own progress. If an intermediate result looks wrong, the agent investigates what went wrong, adjusts its approach, and tries again. This closed-loop, self-learning process shifts iteration from the user into the agent itself.

## Context is everything

High-quality answers depend on rich, accurate context. The agent is built around multiple layers:

1.  **Table Usage:** Relies on schema metadata and table lineage.
2.  **Human Annotations:** Curated descriptions capturing intent and semantics.
3.  **Codex Enrichment:** Deriving code-level definitions for deeper understanding.
4.  **Institutional Knowledge:** Accessing Slack and internal documentation.
5.  **Memory:** Saving corrections and nuances to improve future performance.
6.  **Runtime Context:** Issuing live queries to validate schemas and data in real-time.

## Built to think and work like a teammate

The agent behaves like a conversational collaborator, carrying context across turns and proactively asking for clarifications. We also introduced "workflows" to package recurring analyses into reusable instruction sets for tasks like weekly business reports.

## Moving fast without breaking trust

We leverage OpenAI’s Evals API to measure and protect response quality. Evaluations compare both the generated SQL and the resulting data against "golden" sets, acting as unit tests to catch regressions.

## Agent security

The agent inherits OpenAI’s existing security model. It operates as an interface layer, enforcing existing permissions so users can only access data they are authorized to see. It also summarizes its reasoning and execution steps for transparency.

## Lessons learned

1.  **Less is More:** Restricted and consolidated tool calls to reduce ambiguity.
2.  **Guide the Goal, Not the Path:** Shifting to higher-level guidance allowed the model's reasoning to produce better results than prescriptive prompting.
3.  **Meaning Lives in Code:** Pipeline logic captured in code provides more accurate context than warehouse signals alone.

## Same vision, new tools

OpenAI continues to improve the agent by increasing its ability to handle ambiguity and integrating it more deeply into daily workflows, with the mission of delivering fast, trustworthy data analysis.
