# Agent Context Engineering: The Definitive Guide (Top 26 Resources)

**Last Updated:** January 2026
**Author:** Michi

"Context Engineering" is the art and science of providing an AI agent with exactly the right information—system instructions, memory, tool outputs, and retrieved context—at each step of its trajectory. As Andrej Karpathy puts it: *"The context window is the working memory (RAM) of the LLM OS."*

This guide curates the **top 26 verified resources** that are **directly** about Agent Context Engineering—no general prompting guides or tangentially related papers.

---

## 🏆 The "Canon": Must-Read Foundations

These are the seminal texts that defined the field. If you only read 5 resources, read these.

### 1. [Effective Context Engineering for AI Agents](https://www.anthropic.com/news/effective-context-engineering-for-ai-agents)
*   **Source:** Anthropic Engineering Team
*   **Published:** September 29, 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The definitive manifesto that popularized "Context Engineering" as the successor to "Prompt Engineering." Details strategies for managing the "attention budget" of agents, including context editing to prune irrelevant tool outputs, compaction for long-horizon tasks, and sub-agent architectures.
*   **Key Insight:** Find the smallest set of high-signal tokens that maximize the likelihood of a desired outcome.

### 2. [Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-engineering-for-AI-Agents)
*   **Source:** Manus AI (Yichao 'Peak' Ji)
*   **Published:** July 18, 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Production-grade insights from building autonomous agents. Details the "Stable Prompt Prefix" for KV-cache optimization, file system as "externalized memory," attention manipulation through todo list recitation, and error preservation strategies.
*   **Key Insight:** Treat the file system as externalized memory—agents should learn to write and read on demand.

### 3. [Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/)
*   **Source:** LangChain
*   **Published:** July 2, 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Breaks down context engineering into four key strategies: **Write** (structured notes), **Select** (retrieval), **Compress** (summarization), and **Isolate** (sub-agents). Includes LangGraph integration examples.
*   **Key Insight:** Context engineering is an umbrella covering instructions, knowledge, and tool feedback.
*   **Companion:** [Video walkthrough](https://youtu.be/4GiqzUHD5AA)

### 4. [Context Engineering for AI Agents](https://weaviate.io/blog/context-engineering)
*   **Source:** Weaviate
*   **Published:** December 9, 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Introduces "The Six Pillars of Context Engineering": Agents, Query Augmentation, Retrieval, Prompting Techniques, Memory, and Tools. Treats the context window as a scarce resource requiring careful allocation.
*   **Key Insight:** Success depends on how information is selected, structured, and delivered at each step.

### 5. [Karpathy: State of GPT (Context as RAM)](https://www.youtube.com/watch?v=bZQun8Y4L2A)
*   **Source:** Andrej Karpathy (Microsoft Build 2023)
*   **Published:** May 23, 2023
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The foundational mental model: **"Context Window = Working Memory (RAM)."** Transformers have perfect memory inside the window but zero memory outside it. Engineers must carefully manage this RAM.
*   **Key Insight:** The single best analogy for understanding why context engineering matters.

---

## � Viral Discussions & Key Moments

The term "Context Engineering" gained widespread adoption through these influential moments.

### 6. [Karpathy's "Context Engineering" Tweet](https://x.com/karpathy/status/1937902205765607626)
*   **Source:** Andrej Karpathy (X/Twitter)
*   **Published:** June 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The tweet that popularized the term: *"Context engineering is the delicate art and science of filling the context window with just the right information for the next step."* Sparked industry-wide adoption.
*   **Key Insight:** Context engineering is about the "next step"—dynamic, not static.

### 7. [Tobi Lutke's Definition](https://x.com/tolobit/status/1927856341076254720)
*   **Source:** Tobi Lutke, CEO of Shopify (X/Twitter)
*   **Published:** June 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** *"Context engineering is the art of providing all the context for the task to be plausibly solvable by the LLM."* Emphasized by Karpathy, this framing went viral.
*   **Key Insight:** When agents fail, it's usually missing context—not model capability.

### 8. [Hacker News: "Effective Context Engineering for AI Agents"](https://news.ycombinator.com/item?id=45418251)
*   **Source:** Hacker News Discussion
*   **Published:** September 2025
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** 500+ comment discussion on Anthropic's blog post. Top comments debate "context rot," sub-agent architectures, and whether MCP is the right abstraction.
*   **Discussion Highlights:** Real practitioner experiences, failure modes, production tips.

---

## 📜 Academic Papers on Agent Context Engineering

These are **peer-reviewed papers** specifically about context engineering for agents.

### 9. [ACE: Agentic Context Engineering](https://arxiv.org/abs/2510.04618)
*   **Source:** Zhang et al. (Stanford / SambaNova)
*   **Published:** October 6, 2025
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Introduces ACE (Agentic Context Engineering), treating contexts as *"evolving playbooks"* that accumulate and refine strategies. Prevents "brevity bias" and "context collapse" through structured, incremental updates. +10.6% improvement on agent benchmarks.
*   **Key Insight:** Contexts should evolve like code—generation, reflection, curation cycles.

### 10. [Context Engineering 2.0: The Context of Context Engineering](https://arxiv.org/abs/2510.26493)
*   **Source:** Hua et al. (Shanghai AI Lab)
*   **Published:** October 30, 2025
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** Positions context engineering as an *"entropy reduction process"*—transforming ambiguous human contexts into low-entropy machine representations. Traces the field's 20-year history from HCI to modern agents.
*   **Key Insight:** Context engineering is not new—it's the evolution of human-computer interaction for AI.

### 11. [Context Engineering for AI Agents in Open-Source Software](https://arxiv.org/abs/2510.21413)
*   **Source:** Mohsenimofidi et al. (University of Canterbury)
*   **Published:** October 24, 2025
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** Studies how open-source projects structure their AI configuration files to provide context. Found wide variation in approaches (descriptive, prescriptive, prohibitive, explanatory).
*   **Key Insight:** Format and structure of context significantly affects generated output quality.



## �📚 Foundational Research Papers

### 12. [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
*   **Source:** Yao et al. (Princeton / Google)
*   **Published:** October 2022
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The paper that defined modern agents. Proves that interleaving "Thought" (reasoning traces) and "Action" (tool calls) in the context performs better than either in isolation.
*   **Key Insight:** The fundamental pattern for all agentic context loops (LangChain, etc.).

### 13. [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
*   **Source:** Park et al. (Stanford / Google)
*   **Published:** April 2023
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The famous "Sims" paper. Introduces the **Memory Stream** architecture, scoring memories by Recency, Importance, and Relevance to determine what enters the context window. Adds "Reflection" to synthesize high-level thoughts.
*   **Key Insight:** The definitive architecture for "human-like" memory in agents.

### 14. [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
*   **Source:** Packer et al. (Letta)
*   **Published:** October 2023
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Introduces "OS-level memory management" for LLMs, treating context as a finite resource with paging (swapping memory in/out) to create "infinite" conversation sessions.
*   **Key Insight:** The LLM agent should manage its own memory like an operating system.

### 15. [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
*   **Source:** Liu et al. (Stanford/Berkeley)
*   **Published:** July 2023
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Exposed the "U-shaped" performance curve—LLMs excel at using information at the start and end of context but ignore information buried in the middle.
*   **Key Insight:** Place critical information at the beginning or end; put queries at the end.

### 16. [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)
*   **Source:** Fan et al. (NVIDIA / Caltech)
*   **Published:** May 2023
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** An embodied Minecraft agent that builds an ever-growing **Skill Library** of executable code. Retrieves relevant skills as context for future problems.
*   **Key Insight:** Demonstrates "executable context"—storing logic, not just text.

---

## 🏭 Industry Production Guides

### 17. [Anthropic: Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol)
*   **Source:** Anthropic
*   **Published:** November 25, 2024
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The open standard for connecting AI assistants to data systems—like "USB-C for AI." Provides a universal protocol for context integration, replacing fragmented custom integrations.
*   **Key Insight:** Standardized context integration is essential for enterprise agents.

### 18. [GitHub Copilot: A Developer's Guide to Prompt Engineering](https://github.blog/developer-skills/github/prompt-engineering-guide-generative-ai-llms/)
*   **Source:** GitHub Engineering
*   **Published:** July 2023
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Reveals the "snippeting" pipeline—how Copilot selects which code chunks to include in context from other files to maximize relevance without overflowing limits.
*   **Key Insight:** Production context selection at scale requires intelligent chunking pipelines.

### 19. [LinkedIn: The Tech Behind the First Agent - Hiring Assistant](https://www.linkedin.com/blog/engineering/generative-ai/the-tech-behind-the-first-agent-from-linkedin-hiring-assistant)
*   **Source:** LinkedIn Engineering
*   **Published:** October 2024
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** Architectural deep-dive into LinkedIn's first production AI agent. Features "experiential memory" for personalization and an agent orchestration layer for complex workflows.
*   **Key Insight:** Enterprise agents need memory systems that persist across sessions.

### 20. [Airbnb: Automation Platform v2 - Improving Conversational AI](https://medium.com/airbnb-engineering/automation-platform-v2-improving-conversational-ai-at-airbnb-d86c9386e0cb)
*   **Source:** Airbnb Engineering
*   **Published:** October 2024
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** Evolution from static workflow-based chatbots to an LLM-native platform. Focuses on runtime context management that dynamically loads trip details and customer history based on intent.
*   **Key Insight:** Dynamic context loading based on detected intent enables natural conversation.

### 21. [Uber: Navigating the LLM Landscape with GenAI Gateway](https://www.uber.com/blog/genai-gateway/)
*   **Source:** Uber Engineering
*   **Published:** September 2024
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** Centralized GenAI Gateway standardizing LLM access across 30+ internal teams. Features PII redaction, intelligent caching, fallback logic, and hallucination detection.
*   **Key Insight:** Context safety (PII handling) and reliability patterns are critical at scale.

---

## 🛠️ Frameworks & Implementation

### 22. [LangChain: Memory & Context Windows](https://python.langchain.com/docs/concepts/memory/)
*   **Source:** LangChain Documentation
*   **Published:** 2023 (continuously updated)
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** Definitive documentation on techniques like `ConversationSummaryBufferMemory`—keeping recent tokens raw while summarizing older context.
*   **Key Insight:** Hybrid memory (raw + summarized) balances detail and efficiency.

### 23. [LangGraph: Orchestrating Multi-Agent Context](https://blog.langchain.dev/langgraph-multi-agent-orchestration/)
*   **Source:** LangChain
*   **Published:** 2024
*   **Rating:** ⭐⭐⭐⭐
*   **Summary:** How to split context across multiple agents (e.g., "Researcher" and "Writer") so no single agent is overwhelmed by the full state.
*   **Key Insight:** Sub-agents with isolated context windows prevent information overload.

### 24. [DSPy: Programming—Not Prompting](https://dspy.ai/)
*   **Source:** Stanford NLP (Omar Khattab)
*   **Published:** 2023 (actively developed)
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** A radical framework that abstracts prompts away entirely. Define "Signatures" (I/O types) and "Modules," and DSPy "compiles" the optimal prompt/context automatically.
*   **Key Insight:** Treat context engineering as a compiler problem, not a writing problem.

### 25. [LlamaIndex: Towards Long Context RAG](https://www.llamaindex.ai/blog/towards-long-context-rag)
*   **Source:** LlamaIndex
*   **Published:** March 2024
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** Answers "Do we need RAG if we have 1M token windows?" (Yes.) Explains "Context Augmented Generation" vs RAG and how to optimize chunk sizes for large windows.
*   **Key Insight:** RAG remains essential even with massive context windows.

---

## 📚 Community Resources

### 26. [Awesome Context Engineering (GitHub)](https://github.com/meirtz/awesome-context-engineering)
*   **Source:** Community (Meirtz)
*   **Published:** 2024 (actively maintained)
*   **Rating:** ⭐⭐⭐⭐⭐
*   **Summary:** The most comprehensive GitHub list tracking papers, tools, and blog posts specifically on context engineering for agents.
*   **Key Insight:** Continuously updated crowdsourced resource list—the best way to stay current.

---

## 🎯 Quick Reference: Key Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Context Compaction** | Summarize older context while keeping recent tokens raw | Long conversations |
| **Externalized Memory** | Use file system or database as extended memory | Multi-session agents |
| **Sub-Agent Isolation** | Delegate tasks to sub-agents with separate context windows | Complex workflows |
| **Stable Prompt Prefix** | Keep system prompt unchanged for KV-cache hits | Production optimization |
| **Note-Taking RAG** | Generate notes on retrieved docs before answering | Noise filtering |
| **Todo Recitation** | Constantly rewrite goals to maintain focus | Long-horizon tasks |
| **Error Preservation** | Keep failures in context to prevent repetition | Learning agents |

---

*This guide focuses exclusively on agent context engineering. For hardware-level attention optimizations (FlashAttention, Ring Attention) or model training techniques (LongLoRA, YaRN), see specialized resources.*
