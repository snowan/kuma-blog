# Agent Design Patterns — Summary & Study Notes

**Source:** Lance Martin  
**Post:** *Agent design patterns*  
**Date:** Jan 9, 2026  
**URL:** [agent design patterns](https://rlancemartin.github.io/2026/01/09/agent_design/)

---
![agent design patterns infographic](./resources/agent-design-patterns-infographic.png)

## 1. Core Idea

Modern AI agents are limited less by model capability and more by **how context, tools, and actions are structured**.

The post argues that **agent design patterns**—especially around context management and tool usage—are now the primary lever for building effective, scalable agentic systems.

---

## 2. Key Design Patterns

### 2.1 Context Engineering (First-Class Concern)

- LLMs degrade when overloaded with context
- Agents need *the right information at the right time*
- Context should behave like **working memory**, not long-term storage

**Key Insight:**  
> More context ≠ better performance

---

### 2.2 Give Agents a Computer

- Agents become far more capable when they can:
  - Run shell commands
  - Execute code
  - Read/write files
- This provides:
  - Persistent state
  - External memory
  - Tool composability

**Examples mentioned:**
- Claude Code
- Manus-style systems
- OS / filesystem-backed agents

---

### 2.3 Multi-Layer Action Space

- Do **not** dump every tool into the prompt
- Use **hierarchical or shorthand actions**
  - e.g., shell commands instead of dozens of APIs
- Expand details only when needed

**Result:**  
- Lower token usage
- Higher reasoning accuracy

---

### 2.4 Progressive Disclosure of Tools

- Initially expose:
  - Minimal tool descriptions
- Allow agents to:
  - Request more details on demand

**Benefits:**
- Reduces distraction
- Improves decision quality
- Keeps prompts compact

---

### 2.5 Offload and Cache Context

- Move large or stable information out of the prompt
- Store in:
  - Files
  - Databases
  - Cached artifacts
- Reload only when needed

**Pattern:**  
Prompt = *pointer*, not *storage*

---

### 2.6 Sub-Agents with Isolated Context

- Spawn sub-agents for:
  - Parallel tasks
  - Specialized reasoning
- Each sub-agent gets:
  - A clean, isolated context window

**Advantages:**
- Reduced interference
- Better modularity
- Easier debugging

---

### 2.7 Evolving Context Over Time

- Agents can maintain:
  - Memory logs
  - Diary entries
  - Summarized experience snapshots
- Enables:
  - Long-running agents
  - Learning from prior executions

**Direction:**  
Toward adaptive, stateful agents

---

## 3. High-Level Takeaways

- Agent performance is now dominated by **architecture**, not prompting tricks
- Context is a scarce resource and must be engineered deliberately
- Tools and memory should live *outside* the LLM whenever possible
- Effective agents resemble:
  - Operating systems
  - Not chatbots

---

## 4. Mental Model

> **LLM = Reasoning Core**  
> **Context = Working Memory**  
> **Filesystem / Tools = Long-Term Memory & Actuators**

---

## 5. Why This Matters

These patterns explain why systems like Claude Code and Manus feel dramatically more capable than vanilla chat agents.

The future of agent design is:
- Context-aware
- Tool-native
- Memory-augmented
- Modular by default

---

![agent design patterns note](./resources/agent-design-patterns-note.png)


--- 

# 📂 Resource Collection: Agent Design Patterns (2026)
*Extracted from [Agent design patterns](https://rlancemartin.github.io/2026/01/09/agent_design/) by Lance Martin (Jan 9, 2026)*

Below is a curated list of tools, papers, and articles defining the modern stack for autonomous AI agents.

### 🛠️ Core Agents & Tools
**Manus (acquired by Meta)**
* **Source:** Manus / E2B
* **Summary:** A highly advanced agent that uses a virtual computer (via E2B) to execute complex tasks. It minimizes tools (under 20) and relies on a bash shell for actions.
* **Link:** [How Manus uses E2B](https://e2b.dev/blog.how-manus-uses-e2b-to-provide-agents-with-virtual-computers)
* **Tag:** #Agents #VirtualComputer

**Claude Code**
* **Source:** Anthropic
* **Summary:** "AI for your operating system." A CLI-first agent that lives on your computer, using cached context and a small set of highly effective tools.
* **Link:** [Karpathy on Claude Code](https://x.com/karpathy/status/2002118205729562949)
* **Tag:** #Agents #CLI

**Cursor Agent**
* **Source:** Cursor
* **Summary:** An agent integrated into the IDE that uses "progressive disclosure" to manage tool definitions, syncing MCP tool descriptions to a folder rather than overloading context.
* **Link:** [Dynamic Context Discovery](https://cursor.com/blog/dynamic-context-discovery)
* **Tag:** #IDE #ContextManagement

**Model Context Protocol (MCP)**
* **Source:** Model Context Protocol
* **Summary:** An open standard for connecting AI models to data and tools. The post discusses how to manage MCP scaling issues to avoid context overload.
* **Link:** [Getting Started with MCP](https://modelcontextprotocol.io/docs/getting-started/intro)
* **Tag:** #Standard #Tools

### 📄 Research Papers & Concepts
**CodeAct: Code as Actions**
* **Source:** Arxiv (Wang et al.)
* **Summary:** A framework showing that agents perform better when they can write and execute code (Python/Bash) rather than just calling restricted JSON tools.
* **Link:** [CodeAct Paper](https://arxiv.org/abs/2402.01030)
* **Tag:** #Paper #ActionSpace

**Context Rot**
* **Source:** Chroma
* **Summary:** Research showing that as context windows grow, the model's ability to retrieve and reason about information ("attention budget") degrades.
* **Link:** [Context Rot Analysis](https://research.trychroma.com/context-rot)
* **Tag:** #Research #ContextWindow

**Recursive Language Models (RLM)**
* **Source:** Prime Intellect
* **Summary:** Proposes that models can learn to manage their own context (compressing history) rather than relying on hand-crafted heuristics.
* **Link:** [Recursive Language Model Blog](https://www.primeintellect.ai/blog/rlm)
* **Tag:** #FutureTech #SelfLearning

**Sleep-time Compute**
* **Source:** Arxiv (Letta AI)
* **Summary:** Explores the concept of agents "dreaming" or thinking offline to consolidate memories and update their internal state between active tasks.
* **Link:** [Sleep-time Compute Paper](https://arxiv.org/abs/2504.13171)
* **Tag:** #Paper #Memory

### 🧠 Context Engineering Guides
**Effective Context Engineering**
* **Source:** Anthropic
* **Summary:** A definitive guide on managing the "attention budget" of LLMs, including strategies for retrieval, offloading, and caching.
* **Link:** [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
* **Tag:** #Guide #BestPractices

**Building Effective Agents**
* **Source:** Anthropic (Barry & Schluntz)
* **Summary:** Defines agents as systems where LLMs direct their own control flow, emphasizing the need for computer access (shell + filesystem).
* **Link:** [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
* **Tag:** #Architecture #Design

**Continual Learning in Token Space**
* **Source:** Letta AI
* **Summary:** Discusses how agents can "learn" without model training by updating their context/instructions based on past experiences (like a diary).
* **Link:** [Continual Learning Blog](https://www.letta.com/blog/continual-learning)
* **Tag:** #Learning #Memory

### 🏗️ Agent Architectures & Patterns
**The Ralph Wiggum Loop**
* **Source:** HumanLayer
* **Summary:** A pattern for long-running agents where they wake up, read state from a file, do work, and sleep—allowing for infinite-duration tasks.
* **Link:** [Brief History of Ralph](https://www.humanlayer.dev/blog/brief-history-of-ralph)
* **Tag:** #Pattern #LongRunning

**Gas Town (Multi-Agent Swarm)**
* **Source:** Steve Yegge (GitHub)
* **Summary:** A multi-agent orchestrator project that coordinates dozens of Claude Code instances to build software, using a "Mayor" agent and git-backed tracking.
* **Link:** [Gas Town GitHub](https://github.com/steveyegge/gastown)
* **Tag:** #MultiAgent #Code

**Claude Diary**
* **Source:** Lance Martin
* **Summary:** A plugin/pattern for Claude Code to reflect on session logs and update its own `CLAUDE.md` instructions, enabling personalization.
* **Link:** [Claude Diary Post](https://rlancemartin.github.io/2025/12/01/claude_diary/)
* **Tag:** #Plugin #Memory