# Analysis: "2025: The Year in LLMs" by Simon Willison

**Source**: [https://simonwillison.net/2025/Dec/31/the-year-in-llms/](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)
**Published**: December 31, 2025
**Analysis Mode**: Standard (Sections I-IV)
**Content Type**: Technical blog / Annual review

---

## I. Core Content (What)

### 1. Core Argument

2025 was the year that reasoning models matured into practical agent infrastructure, democratizing competitive AI across Chinese labs while fundamentally challenging established vendors' dominance—though this progress comes with serious security concerns and environmental sustainability questions.

### 2. Key Concepts

| Term | Definition (as used by author) |
|------|-------------------------------|
| **Reasoning models** | Models using inference-scaling/RLVR that excel at multi-step problem solving by breaking complex tasks into intermediate calculations |
| **Agents** | "An LLM that runs tools in a loop to achieve a goal" |
| **Coding agents** | CLI-based tools that allow LLMs to write, debug, and modify code autonomously (Claude Code, Codex CLI, Gemini CLI) |
| **Vibe coding** | Andrej Karpathy's term for fully LLM-assisted development where developers "forget that the code even exists" |
| **The Lethal Trifecta** | Prompt injection scenarios combining: (1) access to private data, (2) ability to communicate externally, (3) exposure to untrusted content |
| **YOLO mode** | Running coding agents with automatic approval enabled, bypassing confirmation steps |
| **Normalization of Deviance** | Accepting dangerous practices as normal due to repeated risk exposure without consequences |
| **Context rot** | Model output quality degradation as context grows |
| **Slop** | Digital content of low quality produced in quantity by AI (Merriam-Webster's 2025 word of the year) |
| **MCP (Model Context Protocol)** | Anthropic's protocol for standardizing tool connections to LLMs |

### 3. Structure

The article is organized as **25+ thematic sections** covering distinct trends:

1. **Technical advancements**: Reasoning models, long-horizon tasks, image generation, academic competition performance
2. **Product ecosystem**: Coding agents, CLI adoption, subscription tiers, async agents
3. **Market dynamics**: Chinese model dominance, Llama's decline, OpenAI's lost monopoly, Google's resurgence
4. **Security concerns**: YOLO mode, browser agents, the Lethal Trifecta
5. **Cultural/terminology**: Vibe coding, slop, pelicans on bicycles benchmark
6. **Personal practice**: 110 tools built, phone-based programming, conformance suites
7. **Broader implications**: Data center opposition, environmental concerns

### 4. Evidence

| Claim | Supporting Evidence |
|-------|---------------------|
| Claude Code's commercial success | "$1bn in run-rate revenue" by December 2025 |
| Chinese model dominance | Top performers (GLM-4.7, Kimi K2, DeepSeek V3.2, MiniMax-M2.1) are all Chinese; DeepSeek R1 triggered "$593bn" NVIDIA market cap drop |
| Image editing explosion | 1 million new ChatGPT users in 60 minutes (March 25, 2025); 130 million users generated 700 million images |
| Long-horizon task improvement | METR research showing "tasks AI can do is doubling every 7 months" |
| Academic performance | o3 and Gemini achieved gold-medal performance at IMO (July) and ICPC (September) |
| Agent mainstream adoption | Major vendors (Anthropic, OpenAI, Google, Alibaba, Mistral) all released CLI coding agents |

---

## II. Background Context (Why)

### 1. Author

**Simon Willison** is a highly respected figure in the developer community:
- Co-creator of the Django web framework
- Creator of Datasette (data exploration tool)
- Prolific open-source contributor and technical blogger
- Has written annual "Year in LLMs" reviews since 2023
- Active hands-on practitioner (built 110 tools in 2025 using LLMs)
- Known for balanced, technically rigorous takes on AI

**Stance**: Enthusiastic but skeptical pragmatist. Uses AI tools extensively while maintaining critical perspective on security risks and hype.

### 2. Context

Written at year-end 2025, this review responds to:
- The explosion of coding agents throughout 2025
- The shift in competitive landscape from US to Chinese labs
- Growing security concerns about AI-enabled browsers and agents
- Environmental backlash against data center construction
- The "agents are coming" narrative that dominated 2024 predictions

### 3. Intent

**Problem to solve**: Provide a comprehensive, practitioner-grounded map of the LLM landscape for developers and AI observers.

**Audience**:
- Developers evaluating AI tools
- Technical leaders making infrastructure decisions
- AI researchers and observers
- The broader tech community seeking informed perspective

### 4. Assumptions

| Assumption | Implication |
|------------|-------------|
| Readers have baseline LLM familiarity | Technical terms used without extensive explanation |
| Practical utility matters more than benchmarks | Emphasis on real-world tool building over abstract capabilities |
| Security risks are underappreciated | Significant attention to YOLO mode, Lethal Trifecta, browser agents |
| Open-weight models are important | Extensive coverage of Chinese open-weight ecosystem |
| The author's personal experience generalizes | 110 tools built, phone coding, etc. presented as indicative trends |

---

## III. Critical Scrutiny

### 1. Counterarguments

| Willison's Position | Potential Counter |
|---------------------|-------------------|
| Agents delivered real value in 2025 | Many "agent" products remain demos; production deployments limited to narrow domains |
| Chinese labs now dominate open-weight | Dominance measured by benchmarks that may not reflect production utility; regulatory/access barriers limit adoption |
| Claude Code's $1bn revenue validates coding agents | Revenue doesn't prove productivity gains; could reflect hype cycle spending |
| Security risks of browser agents are serious | Industry may solve prompt injection; risks may be overstated relative to existing attack vectors |
| Local models improving but cloud moving faster | This gap may close; 2026 hardware could change calculus |

### 2. Reasoning Flaws

**Selection bias**: The 110 personal projects and phone-based programming represent one developer's workflow, not necessarily generalizable patterns.

**Benchmark skepticism inconsistency**: Willison rightly questions benchmark-chasing but uses IMO/ICPC results as evidence of capability advancement.

**Revenue as validation**: The $1bn Claude Code revenue is cited without context about cost structure, retention, or whether it represents sustainable value creation.

**Pelicans on bicycles**: While charming, using a quirky benchmark to assess model quality conflates creative generation with broader capabilities.

### 3. Boundary Conditions

The analysis holds well for:
- English-language, US/Western developer contexts
- Individual developers and small teams
- Exploratory/prototyping workflows

May not hold for:
- Enterprise production deployments with compliance requirements
- Non-English language markets (despite Chinese model coverage)
- Industries with strict security requirements (healthcare, finance, government)
- Teams without strong technical fundamentals to evaluate AI output

### 4. Omissions

| Topic | What's Missing |
|-------|---------------|
| **Enterprise adoption** | Little discussion of how large organizations are actually deploying these tools |
| **Economic impact** | No analysis of job displacement, productivity gains at scale, or labor market effects |
| **Model capabilities beyond coding** | Heavy focus on coding agents; less on scientific research, creative work, customer service |
| **Failure modes** | Success stories emphasized; systematic failures underexplored |
| **Non-Western perspectives** | Chinese models covered technically but not culturally/politically |
| **Regulatory landscape** | EU AI Act, US executive orders, China regulations barely mentioned |
| **Cost analysis** | $200/month subscriptions mentioned but TCO for agent workflows not explored |

---

## IV. Value Extraction

### 1. Reusable Frameworks

**The Agent Definition Framework**
> "An LLM that runs tools in a loop to achieve a goal"

This simple definition cuts through hype and enables productive discussion. Apply when evaluating any "AI agent" product.

**The Lethal Trifecta**
Three-part checklist for evaluating AI security risk:
1. Access to private data?
2. Ability to communicate externally?
3. Exposure to untrusted content?

If all three: maximum caution required.

**Conformance Suite Strategy**
When working with LLM coding agents:
- Provide existing test suites for dramatically better results
- Treat tests as "conformance suites" that guide agent behavior
- Implication: protocols/languages should include language-agnostic test suites

**Normalization of Deviance Warning**
From Johann Rehberger: repeated exposure to risk without consequences leads to accepting dangerous practices as normal. Apply to any convenience-vs-security tradeoff.

### 2. Role-Specific Takeaways

| Role | Key Insight |
|------|-------------|
| **Developer** | Coding agents are production-ready for CLI workflows; invest in learning Claude Code/Codex CLI/Gemini CLI |
| **Engineering Manager** | Security training needed for "YOLO mode" risks; establish team policies for agent approval flows |
| **Security Professional** | Browser-based agents represent new attack surface; the Lethal Trifecta is a useful risk assessment framework |
| **Product Manager** | $200/month subscription tier validates power-user willingness to pay; async agents (queue task, receive PR) emerging pattern |
| **Startup Founder** | Chinese open-weight models (DeepSeek, Qwen) offer cost-effective alternatives to OpenAI/Anthropic |
| **Technical Writer** | Vibe coding produces usable but non-production code; human review remains essential |
| **CTO/Architect** | Local vs. cloud model tradeoff unresolved; plan for 128GB+ RAM requirements if pursuing local agent infrastructure |

### 3. Perception Shifts

**Before reading**: "Agents are mostly hype; OpenAI leads the field"

**After reading**:
- Agents (properly defined as tool loops) are delivering real value, especially for coding
- Chinese labs now lead open-weight models; the competitive landscape has fundamentally shifted
- Security risks from AI-enabled browsers and YOLO mode are underappreciated
- The environmental sustainability of data center growth faces genuine opposition
- OpenAI faces real competitive pressure from Google and Chinese labs
- Phone-based serious coding with LLMs is now possible (not just small scripts)

---

## Summary

Simon Willison's 2025 review provides an authoritative, practitioner-grounded map of the LLM landscape. Its greatest strengths are the clear agent definition that cuts through hype, the security frameworks (Lethal Trifecta, Normalization of Deviance), and the honest assessment of shifting competitive dynamics toward Chinese labs.

The review is most valuable for individual developers and technical leaders evaluating tool adoption. It's less useful for enterprise deployment planning or non-coding use cases. The heavy emphasis on Willison's personal experience (110 tools, phone coding) provides concrete evidence but may not generalize to all contexts.

**Bottom line**: Essential reading for anyone working with or evaluating LLM tools, with particular value in its security warnings and practical framework definitions.

---

## Fact-Check Notes

Key claims from the original article were verified against external sources:

| Claim | Verification | Source |
|-------|-------------|--------|
| Claude Code released February 2025 | ✓ Confirmed: February 24, 2025 alongside Claude 3.7 Sonnet | [Anthropic](https://www.anthropic.com/news/claude-opus-4-5), [TechCrunch](https://techcrunch.com/2025/02/24/anthropic-launches-a-new-ai-model-that-thinks-as-long-as-you-want/) |
| DeepSeek R1 triggered ~$593bn NVIDIA drop | ✓ Confirmed: $589bn drop on January 27, 2025—largest single-day market cap loss in US history | [NBC News](https://www.nbcnews.com/business/business-news/nvidia-loses-market-value-chinese-ai-startup-deepseek-debut-rcna189431), [Yahoo Finance](https://finance.yahoo.com/news/nvidia-stock-plummets-loses-record-589-billion-as-deepseek-prompts-questions-over-ai-spending-135105824.html) |
| Simon Willison is Django co-creator | ✓ Confirmed: Created Django in 2003-2004 with Adrian Holovaty at Lawrence Journal-World | [Wikipedia](https://en.wikipedia.org/wiki/Simon_Willison) |
| OpenAI o3 achieved IMO gold medal (July 2025) | ✓ Confirmed: Scored 35/42 points, meeting gold threshold; some controversy over official grading | [OpenAI](https://x.com/OpenAI/status/1946594928945148246), [TechCrunch](https://techcrunch.com/2025/07/21/openai-and-google-outdo-the-mathletes-but-not-each-other/) |
| Gemini achieved ICPC gold (September 2025) | ✓ Confirmed: Gemini 2.5 Deep Think solved 10/12 problems at ICPC World Finals in Baku | [Google DeepMind](https://deepmind.google/blog/gemini-achieves-gold-medal-level-at-the-international-collegiate-programming-contest-world-finals/) |
| ChatGPT image editing viral growth | ⚠️ Clarified: 1 million users in 60 minutes (not "100 million in a week"); 130 million users generated 700 million images | [Fortune](https://fortune.com/2025/04/01/sam-altman-chatgpt-signups-soar-hayao-miyazaki-image-generation-feature/) |
| Llama 4 released April 2025 | ✓ Confirmed: April 5, 2025; Scout (109B total/17B active) fits on single H100; Maverick (400B total/17B active) uses MoE | [Meta AI Blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/), [Hugging Face](https://huggingface.co/blog/llama4-release) |

---

*Analysis generated: January 2026*
*Framework: AI Analysis (Standard Mode)*
