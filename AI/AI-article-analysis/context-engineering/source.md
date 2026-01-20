# How agents can use filesystems for context engineering

By Nick Huang

A key feature of [deep agents](https://www.blog.langchain.com/deep-agents/) is their access to a set of filesystem tools. Deep agents can use these tools to read, write, edit, list, and search for files in their filesystem.

In this post, we’ll walk through why we think filesystems are important for agents. In order to understand how filesystems are helpful, we should start by thinking through where agents can fall short today. They either fail because (a) the model is not good enough, or (b) they don’t have access to the right context. Context engineering is the [“delicate art and science of filling the context window with just the right information for the next step”](https://x.com/karpathy/status/1937902205765607626?ref=blog.langchain.com). Understanding context engineering - and how it can fail - is crucial for building reliable agents.

## A view of context engineering

One way to view the job of a modern day agent engineer is through the lens of [context engineering](https://www.blog.langchain.com/the-rise-of-context-engineering/). Agents generally have access to a lot of context (all support docs, all code files, etc). In order to answer an incoming question, the agent needs some important context (which contains the context needed to answer the question). While aiming to answer said question, the agent retrieves some body of context (to pull into it’s context window).

When viewed from this lens, there are many ways that context engineering can “fail” for agents:
- If the context that the agent needs is not in the total context, the agent cannot succeed.
- If the context that the agent retrieves doesn’t encapsulate the context that the agent needs.
- If the context that the agent retrieves is far larger than the context that the agent needs (wasteful).

Specific challenges:
1. **Too many tokens**: Retrieved context >> necessary context. Web search results clog history.
2. **Needs large amounts of context**: Necessary context > supported context window. "Agentic search" loops fill context quickly.
3. **Finding niche information**: Retrieved context ≠ necessary context. Semantic search fails on technical docs/code; need precise lookup.
4. **Learning over time**: Total context ≠ necessary context. Agents lack persistent memory of user instructions/preferences.

## How can a filesystem make an agent better?

In the simplest terms: a filesystem provides a single interface through which an agent can flexibly store, retrieve, and update an infinite amount of context.

### Too many tokens
Instead of conversation history, use filesystem as a "scratch pad". Offload large search results to files, then grep/read only what's needed. Keep context window clean.

### Needs large amounts of context
- **Long horizon plans**: Store plans in files, read back to "remind" agent of goals.
- **Subagent knowledge**: Subagents write findings to files instead of passing huge text blobs back to main agent.
- **Skills/Instructions**: Store complex instructions as files (Anthropic skills), read dynamically instead of bloating system prompt.

### Finding niche information
Filesystems allow `ls`, `glob`, `grep`.
- Models are trained for this (Bash tool use).
- Information is already structured (directories).
- Precise traversal: isolate specific files/lines unlike semantic search fuzzy matching.

### Learning over time
Agents can write to their own filesystem to "remember" user feedback or instructions.
- Automate updating "system prompt" context by writing strictly to a "memory" file.
- Store user preferences (name, email, specific rules).
- Allows LLMs to grow their own skillsets.

## See how a deep agent can make use of its filesystem
LangChain has an open source repo called Deep Agents (Python, TypeScript) that creates filesystem-enabled agents with these patterns baked in.
