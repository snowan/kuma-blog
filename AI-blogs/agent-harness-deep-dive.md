# The Agent Harness: The Infrastructure Layer That Makes AI Agents Actually Work

## Metadata
- **Created:** 2026-02-21
- **Status:** Published
- **Tags:** AI Agents, Agent Harness, LLM Infrastructure, Enterprise AI, Anthropic, OpenAI

---

## TL;DR

Everyone is building AI agents. Few are building what actually makes them work. The **agent harness** — the infrastructure layer that wraps around a model to give it memory, tools, safety, and persistence — is what separates a clever demo from a reliable production system. In 2025, we built agents. In 2026, we're building the harnesses that make them last.

---

## The Core Problem: Models Are Brilliant, but Amnesiac

Imagine hiring the world's most capable consultant. She can write code, analyze contracts, browse the web, and reason through complex problems at superhuman speed. There's one catch: every morning she wakes up with no memory of the day before. She doesn't know your project, your codebase, your preferences, or what she finished last Tuesday.

That's an LLM without a harness.

A frontier model like Claude or GPT-4o can reason, plan, and execute sophisticated tasks within a single context window. But enterprise work doesn't fit in a context window. It spans days, involves multiple systems, requires human approval at critical junctures, and demands an audit trail when something goes wrong. The model cannot solve these problems on its own. The **infrastructure around the model** must solve them.

That infrastructure is the agent harness.

---

## What Is an Agent Harness?

An agent harness is the software layer that wraps around an AI model to manage its **lifecycle, context, tools, memory, and safety constraints** — everything the model needs to function reliably in the world, but cannot provide for itself.

The definition from [Salesforce](https://www.salesforce.com/agentforce/ai-agents/agent-harness/), which has built one of the largest commercial agent platforms, is crisp:

> *"An AI agent harness is the operational software layer that manages an AI's tools, memory, and safety to ensure reliable, autonomous task execution."*

Parallel.ai's [technical breakdown](https://parallel.ai/articles/what-is-an-agent-harness) adds a crucial clarification:

> *"The harness is not the 'brain' that does the thinking. It is the environment that provides the brain with the tools, memories, and safety limits it needs to function."*

The brain and the harness are distinct. You can swap the brain (upgrade to a newer model) without touching the harness. You can scale the harness (add more guardrails, more memory backends, more tools) without retraining the model. This separation is deliberate and powerful.

### The Three-Layer Stack

Before going deeper, it helps to understand where the harness sits in the full agent stack:

```
┌────────────────────────────────────────────┐
│             Agent Harness                  │  ← The focus of this post
│  (lifecycle, memory, tools, safety, HIL)   │
├────────────────────────────────────────────┤
│             Agent Runtime                  │
│  (state machines, persistence, graph exec) │
├────────────────────────────────────────────┤
│             Agent Framework                │
│  (abstractions, tool definitions, chains)  │
└────────────────────────────────────────────┘
```

LangChain's team drew this distinction [explicitly](https://blog.langchain.com/agent-frameworks-runtimes-and-harnesses-oh-my/): LangChain is a **framework**, LangGraph is a **runtime**, and DeepAgents is a **harness**. Each level adds a different kind of abstraction. The harness is the outermost layer — the one that touches the real world.

---

## Why Agents Fail Without a Harness

Three failure modes kill agents in production:

### 1. Context Rot

Every model has a fixed context window. In long-running tasks, that window fills with tool outputs, conversation turns, and intermediate results. As the window approaches its limit, the agent begins to "forget" the original goal. It ignores instructions from the start of the session. It re-does work it already completed. It declares victory when the task is half-finished.

Anthropic's engineering team [documented this precisely](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents): agents often "run out of context in the middle of implementation, leaving the next session to start with features half-implemented and undocumented." Even with context compaction — summarizing older messages to free window space — the summary doesn't always carry forward the right details.

### 2. Agent Collision

Multi-agent systems create a coordination problem. When several agents work in parallel toward a shared goal, each makes locally rational decisions that can be globally destructive. One agent writes a file another is reading. Two agents implement the same feature. An agent declares a task done before a dependency finishes. Without a harness managing shared state and locking, agents collide.

### 3. Black-Box Decisions

An agent without observability is a liability in any regulated environment. When it fails — and it will fail — you need to know what it decided, what tools it called, what data it read, and why it took the action it took. A raw LLM loop gives you none of this. The harness must record every step, every tool call, every decision, before the agent touches any production system.

---

## The Six Core Components of an Agent Harness

### Component 1: Context Management

Context management is the harness's job of controlling what the model sees — and what it doesn't.

**The challenge:** Models nominally have large context windows (128K to 1M+ tokens), but research consistently shows they effectively use only the first and last 8K–50K tokens. Critical instructions buried in the middle get ignored.

**What the harness does:**
- **Prioritization**: Keeps the task goal and current state near the beginning of the context; compresses or evicts stale tool outputs
- **Compaction**: When the window fills, the harness summarizes the session — preserving architectural decisions, unresolved bugs, and open questions, while discarding repetitive tool outputs
- **Artifact externalization**: Instead of keeping everything in-context, the harness writes structured artifacts to disk (feature lists, progress files, git state) that the next session can read on startup

**Anthropic's implementation in Claude Code:** The [Claude Agent SDK](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) passes the full message history to the model to generate a compressed summary when approaching the context limit. The summary explicitly preserves what matters: architectural decisions, unresolved bugs, in-progress implementations. It discards what doesn't: redundant tool confirmations, exploratory dead ends.

```
Session N (approaching limit)
  ↓ compaction
  ↓ "You were implementing OAuth. Files changed: auth.py, models.py.
  ↓  Next: wire up the token refresh endpoint. Tests failing: test_refresh_token."
Session N+1 (starts fresh, loaded context)
```

### Component 2: Tool Orchestration

Tools are how agents act on the world. The harness manages the entire tool call lifecycle: detection, validation, execution, and result injection.

**The lifecycle:**
1. Model generates text containing a tool call (a structured JSON block)
2. Harness intercepts the output, detects the tool call pattern
3. Harness **pauses** model text generation
4. Harness executes the tool in an appropriate sandbox (browser, shell, database, API)
5. Harness injects the result back into the model's context
6. Model resumes reasoning over the live result

**What sophisticated harnesses add on top:**
- **Tool access control**: Only certain agents can call certain tools (the filing agent can't delete the database)
- **Rate limiting**: Prevents an agent from hammering an external API in a loop
- **Sandboxing**: Code execution happens in an isolated container; filesystem writes are scoped to a working directory
- **Retry logic**: On transient failures, the harness retries with exponential backoff before surfacing the error to the model

**Anthropic's implementation:** The [computer use framework](https://cobusgreyling.medium.com/anthropics-claude-3-5-computer-use-framework-ai-agent-6b3c48dac410) gives Claude access to specialized tools — `computer` for GUI interaction via screenshots, `bash` for shell commands, `text_editor` for file manipulation — each with their own execution environment and sandboxing layer. Claude Code's harness (now the Claude Agent SDK) manages these tool calls through a recursive loop: `claude → tool call → harness executes → result → claude → ...`

### Component 3: Memory Architecture

Memory is how agents accumulate knowledge across time. The harness implements multiple memory tiers with different latencies, capacities, and persistence guarantees.

**The four memory tiers:**

| Tier | What It Stores | Lifetime | Implementation |
|------|---------------|---------|----------------|
| **Working Memory** | Current task state, recent messages | Current session | In-context window |
| **Episodic Memory** | Past task summaries, decisions made | Days to weeks | Vector DB, key-value store |
| **Semantic Memory** | Domain knowledge, user preferences, codebases | Long-term | Vector DB + retrieval |
| **Procedural Memory** | How to do recurring tasks (skills) | Permanent | Prompt templates, skill libraries |

**LangChain DeepAgents' implementation:** The harness provides a [configurable virtual filesystem](https://docs.langchain.com/oss/python/deepagents/harness) as its primary memory backend. File system operations (read, write, search) become the memory interface. Any backend — local disk, S3, a database — can plug in behind the same interface. Memory, code execution, and context management all share this filesystem abstraction.

**Letta's (MemGPT) implementation:** Uses a three-tier architecture: in-context `core_memory` blocks for the agent's current self-model and task state; `archival_memory` for long-term vector search; and `conversation_memory` with automatic pagination when the message buffer grows too large.

### Component 4: Human-in-the-Loop (HITL)

Agents that act autonomously on production systems must pause at high-stakes decisions. The harness implements the checkpoint system that makes this possible.

**The mechanism:**
1. Every tool call passes through a **policy engine** before execution
2. The policy engine classifies the action by risk level (read-only vs. write vs. destructive)
3. High-risk actions trigger a **pause**: execution halts, a notification fires, a human reviews
4. The human approves, rejects, or modifies the proposed action
5. The harness resumes (or aborts) based on the decision

**What this looks like in practice:**
- An agent that can read any file but must ask before writing to production configs
- An agent that can query any database but must approve before running UPDATE or DELETE
- An agent that can browse the web but must confirm before submitting any form

**Anthropic's Claude Code harness:** Implements HITL through permission scopes. The harness checks each bash command and file operation against a permission set (read-only mode, sandbox mode, full access mode). In enterprise deployments, this maps to a formal approval queue. The agent cannot proceed until the human approves or rejects.

**LangGraph's implementation:** [Built-in interrupt patterns](https://docs.langchain.com/oss/python/langchain/human-in-the-loop) that pause graph execution at any node. The state machine checkpoints its state to durable storage before pausing, so if the human takes 30 minutes to respond, the graph resumes exactly where it left off — with no context lost.

### Component 5: Lifecycle Management

An agent harness manages the full lifecycle of an agent: initialization, execution, session handoffs, recovery from failure, and graceful termination.

**The challenges the harness solves:**
- **Cold start**: On first launch, set up the working environment (git repo, feature list, progress files)
- **Warm resume**: On subsequent launches, reload prior state from persistent artifacts
- **Session handoff**: When a session ends (context full, timeout, user exit), write a structured handoff document for the next session
- **Crash recovery**: If the agent dies mid-task, the harness can recover the last checkpoint and resume

**Anthropic's two-agent harness for long-running tasks:**

The [engineering blog post](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) describes a two-agent pattern that solves the session handoff problem:

```
Initializer Agent (runs once)
  ├── Expands the user's prompt into 200+ granular feature requirements
  ├── Marks all features as "failing" in a JSON feature list
  ├── Sets up the git repository and CI scaffold
  └── Hands off to the Coding Agent

Coding Agent (runs each session)
  ├── On startup: reads feature list, git log, progress file
  ├── Picks the next failing feature
  ├── Implements, tests, marks as passing
  ├── On context approaching limit: writes handoff notes to progress file
  └── Commits clean state to git
```

The session handoff is not just a summary: it's a structured artifact. The coding agent leaves explicit notes about what it tried, what it left unfinished, and what the next session should do first. This dramatically reduces the "forgot what I was doing" failure mode.

### Component 6: Observability and Evaluation

An agent harness records every step so you can understand, debug, and improve agent behavior.

**What the harness captures:**
- Every message in the conversation loop
- Every tool call: name, arguments, result, latency, error
- Every decision point: what options the agent considered, which it chose
- Every state transition: what changed in memory, filesystem, external systems

**What evaluation does with this data:**
- **Regression testing**: Did a model update break a workflow that previously passed?
- **Correctness scoring**: Did the agent reach the right answer, or just a confident-sounding wrong one?
- **Efficiency metrics**: How many tool calls did it take? How much context did it consume?
- **Safety auditing**: Did the agent ever attempt an action it wasn't authorized to take?

**OpenAI's eval harness:** The [OpenAI Evals framework](https://github.com/openai/evals) defines evals as: `prompt → captured run (trace + artifacts) → checks → score`. The harness records the full trace of an agent run. A separate grader (which can itself be an LLM) then scores each trace against a rubric. Scores accumulate into a dashboard that tracks model and harness quality over time.

**Anthropic's Bloom:** An [open-source agentic framework](https://alignment.anthropic.com/2025/bloom-auto-evals/) for behavioral evaluations. Given a target behavior to evaluate (e.g., "does the agent refuse to execute unauthorized SQL?"), Bloom automatically generates a battery of test scenarios, runs the agent against them, and quantifies how often the behavior occurs and how severe it is when it does.

---

## Real Companies, Real Harnesses

### Anthropic: Claude Code / Claude Agent SDK

Claude Code is, in essence, an agent harness. [Anthropic's engineering team](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) describes it directly: "Claude Code is a flexible agent harness." The core primitives — context compaction, tool execution, HITL approval, session persistence — were extracted from Claude Code and published as the Claude Agent SDK, enabling any team to build long-running agents with the same infrastructure.

Key design decisions:
- **Filesystem as IPC**: Agent coordination happens through files, not sockets. Simple, debuggable, backend-agnostic.
- **Git as state**: Committed code is clean state. A crash mid-commit is recoverable because git is transactional.
- **Structured handoffs**: Progress is written to explicit files (not just context summaries) that survive session boundaries.

### OpenAI: Harness Engineering with Codex

OpenAI's internal team built a product called "harness engineering" — and published [a detailed breakdown](https://openai.com/index/harness-engineering/) of what it means to build large-scale software with Codex agents instead of human engineers.

Their harness has three distinctive components:

**Context Engineering**: A continuously maintained knowledge base embedded in the codebase itself. Agents have access to observability data, browser navigation, and architectural documentation as live context — not static snapshots.

**Architectural Constraints**: Enforced not just by LLM judgment but by **deterministic linters and structural tests**. An agent cannot merge code that violates architectural rules; the harness catches violations mechanically before they propagate.

**Garbage Collection Agents**: Periodic agents that scan the codebase for documentation drift, architectural violations, and stale constraints. They fight entropy. Without them, a million-line AI-generated codebase would degrade into chaos.

The result: a team of Codex agents wrote approximately **one million lines of production code across 1,500 pull requests in five months**, with zero manually-written code.

### LangChain: DeepAgents (Open-Source Harness)

LangChain published [DeepAgents](https://github.com/langchain-ai/deepagents) as an explicit, opinionated agent harness. Its architecture makes the harness abstraction concrete:

```python
# DeepAgents harness: batteries included
harness = Harness(
    filesystem=LocalFilesystem(base_dir="./workspace"),
    memory=VectorMemory(backend="chroma"),
    hitl=HumanApprovalMiddleware(risk_threshold="high"),
    subagents=SubagentPool(max_workers=4),
    planning=PlannerTool()
)

agent = Agent(model="claude-3-7-sonnet", harness=harness)
agent.run("Build a REST API for the user management spec")
```

Key capabilities:
- **Planning tool**: The agent breaks work into a plan before executing, giving the harness structure to track progress
- **Filesystem backend**: Memory, code artifacts, and context all share one storage interface; swap from local disk to S3 without changing agent code
- **Subagent spawning**: The harness manages ephemeral sub-agents for isolated parallel tasks — each gets its own context, its own filesystem scope, its own HITL policy

### Salesforce: Agentforce

Salesforce's [Agentforce](https://www.salesforce.com/agentforce/) is the enterprise-grade harness designed for CRM-native agents. Its harness abstractions are built around enterprise concerns that pure ML companies often overlook:

- **Data 360**: A unified data layer with PII redaction on ingestion, so agents never see raw customer data in their context
- **Intelligent Context**: Unstructured CRM data (emails, notes, call logs) is automatically structured before entering agent context
- **Governance controls**: Role-based access control on which agents can call which tools — a support agent cannot access billing systems
- **Agentforce 3 observability**: Per-agent audit trails that satisfy enterprise compliance requirements

---

## Applying the Agent Harness to Enterprise Systems

The research is clear: context engineering, tool management, memory, and observability are table stakes for any production agent system. Here's what each component means when you build one yourself.

### Design Principle 1: Externalize All State

**Never** rely on context as your only state store. Context is ephemeral — it disappears when the session ends. Every piece of state that must survive a session boundary goes into an external store:

- Work-in-progress → git commits (atomic, reversible)
- Task tracking → a JSON file or database row (readable by the next session)
- Decisions made → a structured log (auditable, debuggable)
- Agent preferences → a vector database (retrievable by semantic search)

The Anthropic harness pattern is instructive: the initializer agent writes a feature list on day one. Every coding session reads that list, finds the next unchecked item, and marks it done when finished. The harness never has to trust the model's memory.

### Design Principle 2: Enforce Safety at the Infrastructure Level

Don't rely on the model to refuse dangerous actions. The model will be convinced, manipulated, or simply confused eventually. Safety must be **deterministic**, enforced by the harness before the tool executes:

```python
class ToolGateway:
    def execute(self, tool_name: str, args: dict, agent_id: str) -> Result:
        # Deterministic policy check — no LLM involved
        policy = self.policy_engine.evaluate(tool_name, args, agent_id)

        if policy.risk_level == "HIGH":
            approval = self.approval_queue.request(tool_name, args)
            if not approval.granted:
                return Result.rejected(approval.reason)

        return self.executor.run(tool_name, args)
```

The key insight from OpenAI's harness: architectural constraints are enforced by **deterministic linters**, not LLM judgment. The LLM can't violate a database schema. The linter catches it mechanically.

### Design Principle 3: Build for Observability First

An agent that you can't debug is worse than no agent at all — it fails opaquely and takes your trust with it. Build your trace model before you build anything else:

```
AgentRun
  ├── session_id: uuid
  ├── agent_id: string
  ├── start_time: timestamp
  ├── task: string
  ├── steps: [
  │     { step: 1, type: "tool_call", tool: "bash", args: {...}, result: {...}, latency_ms: 243 },
  │     { step: 2, type: "reasoning", content: "...", tokens: 847 },
  │     { step: 3, type: "hitl_pause", reason: "write to prod database", approved_by: "alice@company.com" },
  │   ]
  └── outcome: { status: "completed", artifacts: ["report.pdf"], score: 0.94 }
```

Every step is logged before the action executes. On failure, you have a complete trace. On success, you have the data to score the run and catch regressions when the model updates.

### Design Principle 4: Plan Before You Act

The biggest predictor of agent success in complex tasks is whether the agent plans before it executes. The harness should require a plan:

1. **Force a planning step**: The harness injects a system prompt that requires the agent to write a plan to a file before taking any external action
2. **Make the plan machine-readable**: JSON, not prose. The harness can parse it, track progress against it, and detect when the agent diverges
3. **Use the plan for recovery**: If the agent crashes mid-task, the harness loads the plan, identifies the last completed step, and resumes from there

This is exactly what Anthropic's initializer agent does: it writes 200+ requirements to a JSON file before a single line of code is written. Every subsequent session reads that file and knows exactly where it stands.

### Design Principle 5: Layer Your Memory

Don't reach for a vector database as your first answer to memory. Build a layered system:

```
┌──────────────────────────────────────┐
│ L1: Working Memory (in-context)      │  Current task, recent steps
│     ~ 8K-32K tokens                  │
├──────────────────────────────────────┤
│ L2: Session Summary (in-context)     │  Compressed prior sessions
│     ~ 2K-4K tokens                   │
├──────────────────────────────────────┤
│ L3: Artifact Store (filesystem)      │  Plans, code, documents
│     Unlimited, structured            │
├──────────────────────────────────────┤
│ L4: Semantic Memory (vector DB)      │  Past runs, preferences, domain knowledge
│     Unlimited, retrieved by query    │
└──────────────────────────────────────┘
```

Retrieve from L4 on task start; summarize L1 into L2 on session end; write outputs to L3 continuously. This gives you the right information at the right time without blowing the context window.

---

## The Shift That Changed Everything

In 2025, every team asked: "Which model should we use?"

In 2026, the smarter teams are asking: "How should we harness it?"

[Aakash Gupta's framing](https://aakashgupta.medium.com/2025-was-agents-2026-is-agent-harnesses-heres-why-that-changes-everything-073e9877655e) is direct: "2025 was agents. 2026 is agent harnesses." The model has become a commodity. The harness is the moat.

Philipp Schmid from Google DeepMind [echoes this](https://www.philschmid.de/agent-harness-2026): "Great harnesses manage human approvals, filesystem access, tool orchestration, sub-agents, prompts, and lifecycle. The harness determines whether agents succeed or fail."

OpenAI's harness engineering experiment is the clearest proof. They didn't build better models to generate a million lines of production code. They built a better harness: better context engineering, better architectural enforcement, better garbage collection. The model was already capable. The infrastructure made it reliable.

The same truth holds for enterprise teams. You don't need a better model to build a reliable agent. You need:

1. **Context management** that keeps the right information in the window
2. **Tool orchestration** that executes safely and recovers from failure
3. **Layered memory** that persists knowledge across sessions
4. **Human-in-the-loop controls** that enforce policy deterministically
5. **Lifecycle management** that handles multi-session work gracefully
6. **Observability** that gives you a complete audit trail

Build these six things, and your agents will work. Skip them, and no model — however powerful — will save you.

---

## Further Reading

- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [LangChain: Agent Frameworks, Runtimes, and Harnesses — Oh My!](https://blog.langchain.com/agent-frameworks-runtimes-and-harnesses-oh-my/)
- [LangChain DeepAgents: An Open-Source Agent Harness](https://github.com/langchain-ai/deepagents)
- [Salesforce: What Is an Agent Harness?](https://www.salesforce.com/agentforce/ai-agents/agent-harness/)
- [Parallel.ai: What Is an Agent Harness?](https://parallel.ai/articles/what-is-an-agent-harness)
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Anthropic: Bloom — Open-Source Behavioral Evaluations](https://alignment.anthropic.com/2025/bloom-auto-evals/)
- [OpenAI Evals GitHub](https://github.com/openai/evals)
- [Philipp Schmid: The Importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026)
