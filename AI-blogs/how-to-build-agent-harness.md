---
title: "How to Build an Agent Harness: A Practical Guide from Teams Who Actually Did It"
date: 2026-03-22
author: "Michi Meow"
categories: ["AI Engineering", "Agent Harness", "Deep Dive"]
tags: ["Agent Harness", "Harness Engineering", "Claude Code", "OpenAI Codex", "Manus", "LangChain DeepAgents", "Stripe Minions", "Context Engineering", "Deep Dive"]
description: "A practical, implementation-level guide to building agent harnesses, synthesized from the hard-won lessons of five production teams: Anthropic (Claude Code), OpenAI (Codex), Manus, LangChain (DeepAgents), and Stripe (Minions)."
---

# How to Build an Agent Harness: A Practical Guide from Teams Who Actually Did It

## The Problem: Your Agent Works in Demos, Dies in Production

You've built an AI agent. It works great in your demo. Then you ship it to real users, and it:
- Gets lost after 15 tool calls and forgets what it was doing
- Loops on the same failed approach for 20 minutes
- Declares the task complete when it's half-done
- Burns through $50 in tokens on a $2 task because it dumped your entire codebase into context
- Produces architecturally incoherent code that compiles but makes no sense

These aren't model intelligence problems. They're **harness engineering** problems. The model is a CPU. Your agent needs an operating system.

This guide synthesizes the implementation patterns and hard-won lessons from five teams that have shipped production agent harnesses: Anthropic (Claude Code), OpenAI (Codex), Manus (now Meta), LangChain (DeepAgents), and Stripe (Minions). Together, these teams represent the state of the art in 2026 — and their failures are more instructive than their successes.

---

## Table of Contents

1. [What You're Actually Building](#what-youre-actually-building)
2. [The Four Production Architecture Patterns](#the-four-production-architecture-patterns)
3. [Building Stage by Stage: Day 1 to Production](#building-stage-by-stage-day-1-to-production)
4. [Context Engineering: The Hard Problem](#context-engineering-the-hard-problem)
5. [The 10 Mistakes Everyone Makes](#the-10-mistakes-everyone-makes)
6. [Lessons from 5 Production Harnesses](#lessons-from-5-production-harnesses)
7. [Measuring Harness Quality: The Metrics That Matter](#measuring-harness-quality-the-metrics-that-matter)
8. [When to Iterate vs. When to Rewrite](#when-to-iterate-vs-when-to-rewrite)
9. [The Minimum Viable Harness](#the-minimum-viable-harness)
10. [Conclusion: Build to Delete](#conclusion-build-to-delete)

---

## What You're Actually Building

An agent harness is **not** a framework. Frameworks (LangChain, CrewAI, OpenAI Agents SDK) give you building blocks. A harness is the complete, batteries-included runtime that wraps a model and makes it operational.

The formula: **Agent = Model + Harness**

```
┌─────────────────────────────────────────────────┐
│                 Agent Harness                     │
│                                                   │
│  ┌───────────────────────────────────────────┐   │
│  │          Context Management                │   │
│  │  (compaction, caching, state offloading)   │   │
│  └───────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────┐   │
│  │          Tool Registry + Execution         │   │
│  │  (sandbox, permissions, error handling)    │   │
│  └───────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────┐   │
│  │          Verification Loops                │   │
│  │  (linters, tests, pre-completion gates)   │   │
│  └───────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────┐   │
│  │          State + Memory                    │   │
│  │  (session, progress files, long-term)     │   │
│  └───────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────┐   │
│  │          Safety + Human-in-the-Loop        │   │
│  │  (permissions, approval gates, sandboxing)│   │
│  └───────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────┐   │
│  │          Observability                     │   │
│  │  (tracing, metrics, cost accounting)      │   │
│  └───────────────────────────────────────────┘   │
│                                                   │
│                 ┌─────────┐                       │
│                 │  Model  │                       │
│                 │  (LLM)  │                       │
│                 └─────────┘                       │
└─────────────────────────────────────────────────┘
```

The model reasons. The harness does everything else.

**My Take:** The reason this distinction matters is economic. LangChain proved it empirically: their DeepAgents jumped from rank 30 to rank 5 on Terminal Bench 2.0 (52.8% to 66.5%) by changing *only the harness* — the model stayed the same. Manus proved it architecturally: they rewrote their harness five times in six months with the same underlying models, and each rewrite made the agent dramatically better. If you're spending time fine-tuning models when your harness is weak, you're optimizing the wrong variable.

---

## The Four Production Architecture Patterns

Every production harness I've studied falls into one of four patterns. Understanding them is the first design decision you'll make.

### Pattern 1: Single-Threaded Master Loop (Claude Code)

```
User Input
    │
    ▼
System Prompt Assembly
    │
    ▼
┌──────────┐
│Model Call │◄─────────────┐
└────┬─────┘               │
     │                     │
     ▼                     │
Tool Calls? ──No──► Return │
     │ Yes                 │
     ▼                     │
Execute Tools              │
(sandboxed)                │
     │                     │
     ▼                     │
Append Results ────────────┘
to Messages
```

One flat message list. No complex threading. No competing agent personas. Subagents are depth-limited to 1 (they cannot spawn their own subagents).

**When to use:** Most tasks. Claude Code proves that a simple, single-threaded loop with disciplined tools and planning delivers controllable autonomy. Start here.

### Pattern 2: Middleware Stack (LangChain DeepAgents)

```
Agent Request
  → LocalContextMiddleware     (map codebase at startup)
  → LoopDetectionMiddleware    (detect repeated failures)
  → ReasoningSandwichMiddleware (allocate compute: high→low→high)
  → PreCompletionChecklistMiddleware (verify before exit)
  → Agent Response
```

Each middleware implements hooks: `before_agent`, `wrap_model_call`, `before_tool_call`, `after_tool_call`. Works like Express.js middleware but for the agent loop. Capabilities are composable — add or remove middleware to change harness behavior.

**When to use:** When you need fine-grained control over the agent loop and want to compose capabilities modularly. Good for benchmarking (swap middleware, measure impact).

### Pattern 3: Protocol-First App Server (OpenAI Codex)

```
┌──────────────────────────────────────┐
│            App Server                 │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │  stdio   │ │ message │ │ thread │ │
│  │  reader  │ │processor│ │manager │ │
│  └────┬─────┘ └────┬────┘ └───┬────┘ │
│       └─────────────┼─────────┘      │
│              Core Threads             │
│  (durable sessions, turns, items)    │
└──────────────┬───────────────────────┘
               │ JSON-RPC over stdio
    ┌──────────┼──────────┐
    ▼          ▼          ▼
  VS Code    CLI       Web App
```

Three primitives: **Thread** (durable session), **Turn** (one unit of work), **Item** (atomic I/O with lifecycle). Same harness powers every surface through a bidirectional JSON-RPC protocol.

**When to use:** When you need to expose the harness through multiple surfaces (CLI, IDE, web). The protocol decouples agent logic from UI.

### Pattern 4: Initializer + Worker Agents (Anthropic Long-Running)

```
Session 1 (Initializer):
  → Create init.sh (environment setup)
  → Generate feature_list.json (200+ granular specs)
  → Create progress.txt
  → Initial git commit

Session N (Worker):
  → Read progress.txt + feature_list.json
  → Run init.sh
  → Verify existing features still work
  → Implement ONE feature
  → Test it → Git commit → Update progress.txt
```

**When to use:** Tasks spanning hours or days that exceed a single context window. The key insight: agents must quickly understand work state when starting with a fresh context window.

**My Take:** If you're building a general-purpose harness, start with Pattern 1 (master loop) and add Pattern 2 (middleware) for extensibility. Pattern 3 is for when you need multi-surface deployment. Pattern 4 is for when your tasks outlive a single context window. Most teams don't need Patterns 3 or 4 initially.

---

## Building Stage by Stage: Day 1 to Production

### Stage 1: The Agent Loop (Day 1)

Every harness starts with the same 20-line core:

```python
# Pseudocode — the universal agent loop
def agent_loop(user_message: str, tools: list, system_prompt: str):
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = model.generate(
            system=system_prompt,
            tools=tools,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": response.content})

        tool_calls = [b for b in response.content if b.type == "tool_use"]
        if not tool_calls:
            return response.text  # loop terminates

        tool_results = []
        for tc in tool_calls:
            result = execute_tool(tc.name, tc.input)
            tool_results.append(tool_result(tc.id, result))
        messages.append({"role": "user", "content": tool_results})
```

A "turn" is one round trip: model produces output with tool calls, harness executes tools, results feed back. The loop ends when the model produces output with no tool calls.

This is your entire harness on day 1. **Do not add anything else until you see this loop fail.**

### Stage 2: Tool Definitions (Day 1-2)

Start with the minimum set. Seriously — Vercel found that *removing* 80% of their tools improved agent performance.

| Category | Tools | Purpose |
|----------|-------|---------|
| Discovery | read_file, list_dir, glob, grep | Let model explore |
| Modification | write_file, edit_file | Let model change things |
| Execution | shell/bash | Let model run commands |
| Planning | write_todos | Let model track multi-step work |

**Key principle:** Do not build massive control flows. Provide robust atomic tools. Let the model make the plan.

### Stage 3: System Prompt Engineering (Day 2-3)

Structure your system prompt in layers:

```
[Identity & Role]         — who the agent is
[Available Tools]         — exact schemas
[Behavioral Rules]        — constraints and guardrails
[Output Format]           — how to respond
[Dynamic Context]         — project state, recent history
```

Keep it under 60 lines. HumanLayer's research found that LLM-generated agent files cost 20% more tokens and hurt performance. Human-written, concise instructions win.

### Stage 4: Permission & Safety Layer (Day 3-5)

Classify operations by risk:

| Risk Level | Examples | Behavior |
|------------|----------|----------|
| **Safe** | read_file, list_dir, grep | Auto-approve |
| **Moderate** | write_file, edit_file | Require confirmation or match whitelist |
| **Dangerous** | shell commands, network access, git push | Require explicit approval |

### Stage 5: Context Management (Day 5-10)

This is where most harnesses succeed or fail. Implement:
- Token counting per message
- Automatic compaction at ~85-92% context capacity
- File-based overflow for large tool outputs
- Cache-aware message construction (append-only design)

### Stage 6: Persistence & State (Day 10-15)

- Progress files (`todo.md`, `progress.txt`) that survive across sessions
- Git integration for checkpointing
- Session state serialization for crash recovery

### Stage 7: Observability & Evaluation (Day 15-20)

- Structured logging of every tool call and result
- Token usage and cost tracking
- LLM-as-judge evaluation pipeline
- Trace-based debugging (link tool calls → reasoning → outcomes)

**My Take:** The ordering matters. I've seen teams jump to Stage 5 (context management) or Stage 7 (observability) before they have a working Stage 1 loop. The biggest insight from Manus's five rewrites: start simple, observe failures, add infrastructure in response to real problems. Pre-designing ideal configurations before real failures occur is the #1 anti-pattern.

---

## Context Engineering: The Hard Problem

If there's one section of this guide to internalize, it's this one. Context engineering — what enters the model's context window, in what order, and what gets evicted — is the single highest-leverage investment in your harness.

Anthropic's context engineering principle: *"Find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."*

### Lesson 1: KV-Cache Hit Rate Is Your Most Important Metric

From Manus (their single most important production metric):

| Token Type | Cost (Claude Sonnet) | Difference |
|------------|---------------------|------------|
| Cached input | $0.30/MTok | Baseline |
| Uncached input | $3.00/MTok | **10x more expensive** |

With a 100:1 input-to-output token ratio, cache efficiency dominates cost. The implementation rules:

1. **Append-only context design** — never modify previous messages
2. **Stable prompt prefixes** — even a single-token change invalidates downstream cache
3. **Deterministic JSON serialization** with stable key ordering
4. **Session-sticky routing** across distributed workers

### Lesson 2: Mask Tools, Never Remove Them

Dynamically removing tools mid-iteration invalidates the KV-cache and confuses the model about previously referenced tools. Instead, mask token logits during decoding — this constrains available actions without modifying tool definitions.

Manus uses a naming convention to enable this: all browser tools start with `browser_`, shell tools with `shell_`. Masking by prefix is cheap and cache-friendly.

### Lesson 3: File System as Unlimited External Memory

The file system is "unlimited in size, persistent by nature, and directly operable by the agent." Use it for:
- Plans and progress tracking (`todo.md`, `progress.txt`)
- Intermediate results too large for context
- Structured memory the agent can read back later

Compression should be **reversible**: drop webpage content if the URL is preserved. Omit document text if the file path remains.

### Lesson 4: Task Recitation Prevents "Lost in the Middle"

Agents working on ~50+ tool call tasks lose track of their objectives. Manus's fix: the agent continuously rewrites a `todo.md` file, pushing the global plan into the model's recent attention span. This is deliberately redundant — the recitation forces the objective into the attention window where it has the most influence.

### Lesson 5: Errors Are Signal, Not Noise

Leave failed actions in context. When the model sees a failed action and the resulting stack trace, it implicitly updates its beliefs and avoids repeating the same mistake. Removing errors removes the learning signal.

**My Take:** Context engineering is genuinely the "dark art" of harness engineering. Manus's $2B acquisition by Meta was essentially an acquisition of their context engineering expertise — same models as everyone else, dramatically better results. The counterintuitive insight: adding more context often makes agents *worse*. The art is knowing what to exclude.

---

## The 10 Mistakes Everyone Makes

Synthesized from all five teams' published post-mortems:

### 1. Over-Engineering Before Understanding Failure Modes

Build the minimum viable harness. Observe how your agent actually fails. Add infrastructure in response to real problems, not anticipated ones. Manus, LangChain, and OpenAI all started simpler than they ended.

### 2. Context Flooding

Dumping all docs, Slack history, and database contents into context is like dumping your entire hard drive into RAM. Sometimes less context produces better results. Be surgical.

### 3. Building Static Harnesses

Models improve rapidly. Manus rewrote 5 times. LangChain re-architected 4 times. Vercel removed 80% of tools and got better results. Build harnesses that are easy to rip out and replace. **Build to delete.**

### 4. Complex Multi-Agent Orchestration Too Early

Start with a single-threaded loop. Claude Code proves this works for most tasks. Add multi-agent patterns only when you have evidence a single agent cannot handle the task.

### 5. Testing Only Happy Paths

Test: context overflow, tool failures, ambiguous instructions, looping behavior, partial completion, and what happens at the 50th tool call.

### 6. Oversized Monolithic Prompts

OpenAI's "one big AGENTS.md" approach failed. A single oversized prompt hides errors and makes debugging harder. Layer your prompts: identity, tools, rules, dynamic context.

### 7. Human-Only Knowledge

From the agent's perspective, anything it cannot access in-context does not exist. Knowledge in Google Docs, Slack threads, or people's heads is invisible. The repository must be the single source of truth.

### 8. Removing Errors From Context

Error messages and stack traces are learning signal. Removing errors removes the implicit feedback loop that helps the model avoid repeating mistakes.

### 9. No Verification Gate

Models declare tasks complete without proper validation. LangChain's `PreCompletionChecklistMiddleware` forces a verification pass before exit — this single hook was a major factor in their 13.7-point benchmark improvement.

### 10. Ignoring KV-Cache Economics

With a 100:1 input-to-output ratio, cache efficiency dominates cost. Modifying earlier messages invalidates the cache for everything downstream. Append-only design delivers **10x cost savings**.

---

## Lessons from 5 Production Harnesses

### OpenAI Codex: "The Scaffolding Is the Product"

3 engineers built ~1 million lines of code in 5 months. What they learned:

- **Strict layered architecture with rigid dependencies.** Agents produce architecturally incoherent code without enforced boundaries. The Codex codebase enforces: Types → Config → Repo → Service → Runtime → UI. Structural tests catch violations.
- **Custom linter messages that double as remediation instructions.** When the agent violates an architectural constraint, the error message tells it how to fix the problem. The tooling teaches the agent while it works.
- **The discipline is in the scaffolding**, not in individual lines of code. The harness, the linters, the tests, and the architectural constraints — that's what makes the code coherent.

### Anthropic Claude Code: "One Feature at a Time"

Two failure patterns for long-running agents:

1. **Over-ambition:** Agents attempt to "one-shot the app," running out of context mid-implementation.
2. **Premature completion:** Agents declare projects done after seeing partial progress.

The fix: a two-agent architecture (initializer + coding agent), one feature at a time, and browser automation (Puppeteer MCP) for end-to-end testing. The session initialization ritual is critical: `pwd` → read git logs → review feature list → run `init.sh` → verify existing functionality → begin new work.

### Manus: "Remove Complexity, Don't Add It"

Five rewrites in six months, each driven by a key insight:

| Rewrite | Key Lesson |
|---------|-----------|
| 1 | KV-cache hit rate is the most important metric |
| 2 | Mask tools via logits, don't remove them from context |
| 3 | Use file system as externalized memory |
| 4 | Constantly rewrite todo.md to manipulate attention |
| 5 | Preserve errors so the model learns from them |

The meta-lesson: each rewrite **removed** complexity. Complex tool definitions replaced by general shell execution. "Management agents" replaced by simple structured handoffs. As models get stronger, build less scaffolding and get out of the model's way.

### LangChain DeepAgents: "The Harness Is the Benchmark"

Gained 13.7 points on Terminal Bench 2.0 by only changing the harness. The four-stage workflow that worked:

**Plan → Build → Verify → Fix**

The "Reasoning Sandwich" allocates maximum compute at planning and verification (the bookends), medium compute during implementation (the middle). This concentrates effort where it matters most.

Critical finding: **harnesses are not model-portable**. Claude Opus scored 59.6% with a Codex-optimized harness (vs. 66.5% for Codex). Every model needs its own harness tuning.

### Stripe Minions: "The Walls Matter More Than the Model"

1,300+ merged PRs per week. The architecture alternates **deterministic nodes** with **agentic nodes**:

```
Agentic:       Agent writes code
Deterministic: Hardcoded linter runs (agent CANNOT skip this)
Agentic:       Agent fixes linter errors
Deterministic: Tests run
Agentic:       Agent fixes test failures (max 2 attempts)
Deterministic: If still failing → flag a human
```

Key rule: **cap retry attempts at 2.** If the LLM can't fix it in two tries, a third won't help. Escalate to a human.

The real moat: Stripe's decade of developer platform investment — 3 million tests, 500+ MCP tools, standardized environments. "If your developer platform is already excellent, agents can leverage it."

**My Take:** The convergent insight from all five teams is the same: constraints increase reliability. Every team that succeeded did so by *restricting* what agents could do, not by giving them more freedom. OpenAI enforced rigid architecture. Stripe made linting mandatory. Manus removed tools. Vercel stripped to essentials. The paradox of agent harness engineering: the more you constrain the agent, the more capable it becomes.

---

## Measuring Harness Quality: The Metrics That Matter

### Primary Metrics

| Metric | What It Measures | Source | Target |
|--------|-----------------|--------|--------|
| **KV-Cache Hit Rate** | Context engineering efficiency | Manus | >80% |
| **Task Completion Rate** | End-to-end reliability | All teams | Track by task type |
| **Benchmark Score Delta** | Points gained by harness changes, model held constant | LangChain (+13.7) | Increasing |
| **Verification Completion Rate** | % of tasks with self-verification before submission | LangChain | >95% |
| **Doom-Loop Frequency** | How often agents get stuck repeating broken approaches | LangChain | <5% |
| **Retry-to-Resolution Ratio** | CI rounds needed per task | Stripe (caps at 2) | <2 |
| **Input-to-Output Token Ratio** | Context usage efficiency | Manus (100:1) | Track trend |

### The Harness-Only Benchmark

This is the most powerful evaluation method: **hold the model constant, vary the harness, measure the delta.**

```python
# Pseudocode — harness-only benchmark
for task in eval_suite:
    for harness_config in [baseline, experiment_a, experiment_b]:
        agent = create_agent(model="claude-sonnet-4", harness=harness_config)
        result = agent.run(task.prompt, tools=task.tools, timeout=300)

        score = grade(result, task.expected_output)
        quality = judge_model.evaluate(task=task.prompt, output=result)

        log(task.id, harness_config.name, score, quality, tokens_used, steps_taken)
```

LangChain used this approach to prove their harness changes were the cause of their benchmark improvements, not model drift. It's the scientific method applied to harness engineering.

### Three Levels of Testing

**Level 1: Tool Unit Tests** — given input X, does tool Y produce output Z?

**Level 2: Scenario Tests** — given a task and initial state, does the agent reach the correct end state?

**Level 3: LLM-as-Judge** — for open-ended tasks, a separate model scores relevancy, correctness, completeness, and efficiency.

---

## When to Iterate vs. When to Rewrite

### Real Rewrite Cadences

| Team | Rewrites | Timeframe | What Triggered Them |
|------|----------|-----------|---------------------|
| Manus | 5 | 6 months | Each model capability jump obsoleted hand-coded logic |
| LangChain | 3-4 | 1 year | Evaluation failures revealed architectural limits |
| Vercel | Major simplification | — | Removing 80% of tools improved results |

### Iterate When:

- New failure pattern appears → add a guardrail
- Agent repeats same mistake → add a linter rule with remediation message
- Context window fills too fast → improve compaction, add sub-agents
- Slow feedback loops → optimize typecheck/build speed to seconds
- KV-cache hit rate dropping → stabilize prompt prefix

### Rewrite When:

- A new model release makes your control flow obsolete
- Your harness is model-specific and you need to switch models
- You can't remove "smart" logic without breaking everything
- Retry logic is more complex than task logic
- Systemic underperformance despite guardrail additions

---

## The Minimum Viable Harness

You can build a working harness in 2-4 hours with 200-500 lines of code:

```
Minimum Viable Harness
  ✓ Agent loop (while tool_calls → execute → feed back)
  ✓ 3-5 tools (read, write, shell)
  ✓ System prompt with tool schemas
  ✓ Basic error handling
  ✓ Console I/O
```

The maturity progression:

| Level | Scope | Timeline | Key Addition |
|-------|-------|----------|--------------|
| Level 1 | Solo developer | 2-4 hours | Agent loop + basic tools |
| Level 2 | Single project | 1-2 days | Context management + persistence |
| Level 3 | Team use | 1-2 weeks | Permissions + observability + middleware |
| Level 4 | Production | 4-12 weeks | Multi-surface API + evaluation + safety |

Production harnesses are 5,000-20,000 lines. But you start at Level 1 and add infrastructure only when the agent actually fails.

---

## Conclusion: Build to Delete

The most important principle in harness engineering is the most counterintuitive: **build to delete.**

Every piece of hand-coded logic is a liability when the next model ships. Manus rewrote 5 times. LangChain rewrote 4 times. What required complex pipelines in 2024 works via simple prompts in 2026. The harness you build today will be partially obsolete within months.

Design for that. Keep components modular. Keep the core loop simple. Add complexity only in response to observed failures, not anticipated ones. And measure everything — because the harness that wins isn't the most sophisticated one, it's the one that makes the model most effective at the tasks your users actually care about.

The formula remains: **Agent = Model + Harness.** You can't control the model. You can control the harness. That's where the leverage is.

---

## Related Resources

### Primary Sources
- [OpenAI: Harness Engineering — Leveraging Codex](https://openai.com/index/harness-engineering/)
- [OpenAI: Unlocking the Codex Harness — How We Built the App Server](https://openai.com/index/unlocking-the-codex-harness/)
- [OpenAI: Unrolling the Codex Agent Loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Manus: Context Engineering for AI Agents — Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [LangChain: Improving Deep Agents with Harness Engineering](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/)
- [LangChain: Evaluating Deep Agents — Our Learnings](https://blog.langchain.com/evaluating-deep-agents-our-learnings/)
- [LangChain: Agent Frameworks, Runtimes, and Harnesses](https://blog.langchain.com/agent-frameworks-runtimes-and-harnesses-oh-my/)

### Architecture & Implementation
- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works)
- [Claude Code Architecture (Reverse Engineered)](https://vrungta.substack.com/p/claude-code-architecture-reverse)
- [LangChain DeepAgents GitHub](https://github.com/langchain-ai/deepagents)
- [Philipp Schmid: The Importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026)
- [Philipp Schmid: Context Engineering Part 2](https://www.philschmid.de/context-engineering-part-2)

### Lessons & Playbooks
- [Stripe's Coding Agents: The Walls Matter More Than the Model](https://www.anup.io/stripes-coding-agents-the-walls-matter-more-than-the-model/)
- [Stripe Minions Blueprint Architecture](https://www.mindstudio.ai/blog/stripe-minions-blueprint-architecture-deterministic-agentic-nodes)
- [The Emerging Harness Engineering Playbook (ignorance.ai)](https://www.ignorance.ai/p/the-emerging-harness-engineering)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [NxCode: Harness Engineering Complete Guide 2026](https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026)
- [Inngest: Your Agent Needs a Harness, Not a Framework](https://www.inngest.com/blog/your-agent-needs-a-harness-not-a-framework)

### Evaluation & Benchmarks
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [HAL: Holistic Agent Leaderboard (Princeton)](https://hal.cs.princeton.edu/)
- [Building a Production-Ready AI Agent Harness (DEV Community)](https://dev.to/apssouza22/building-a-production-ready-ai-agent-harness-2570)
