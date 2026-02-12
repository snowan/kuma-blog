# The Complete Guide to Building Skills for Claude — Summary & Key Takeaways

**Source**: [The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en)
**Author**: Anthropic
**Date**: 2026-02-12

---

![Building Skills for Claude — Kawaii Infographic](./resources/kawaii-skills-guide-infographic.png)

## TL;DR

Anthropic just published a comprehensive 33-page guide on building **skills** for Claude — the most powerful way to customize Claude for repeatable workflows. A skill is simply a folder with a `SKILL.md` file that teaches Claude *how* to handle specific tasks. Think of it as "teach Claude once, benefit every time." This post walks through the key concepts, architecture, patterns, and practical tips from the guide so you can start building your own skills today.

---

## What Is a Skill?

A skill is a folder containing:

| File | Purpose |
|------|---------|
| `SKILL.md` (required) | Instructions in Markdown with YAML frontmatter |
| `scripts/` (optional) | Executable code (Python, Bash, etc.) |
| `references/` (optional) | Documentation loaded as needed |
| `assets/` (optional) | Templates, fonts, icons for output |

> Skills work across Claude.ai, Claude Code, and the API — create once and use everywhere.

The guide emphasizes three core design principles:

1. **Progressive Disclosure** — A three-level system minimizes token usage:
   - *Level 1*: YAML frontmatter — always loaded, tells Claude *when* to use the skill
   - *Level 2*: SKILL.md body — loaded when Claude thinks it's relevant
   - *Level 3*: Linked files — only navigated as needed

2. **Composability** — Skills should work alongside other skills, not assume exclusive access.

3. **Portability** — One skill works identically across Claude.ai, Claude Code, and API.

---

## Skills + MCP: The Kitchen Analogy

Anthropic uses a great analogy:

> **MCP** provides the professional kitchen — access to tools, ingredients, and equipment.
> **Skills** provide the recipes — step-by-step instructions on how to create something valuable.

Without skills, users connect MCP but don't know what to do next. With skills, pre-built workflows activate automatically with consistent, reliable results.

| | MCP (Connectivity) | Skills (Knowledge) |
|---|---|---|
| **What** | Connects Claude to your service | Teaches Claude *how* to use your service |
| **Role** | What Claude *can* do | How Claude *should* do it |
| **Benefit** | Real-time data & tool access | Workflows & best practices |

---

## Planning Your Skill

### Start with Use Cases

Before writing any code, identify 2–3 concrete use cases. A good definition includes:
- **Trigger** — what the user says
- **Steps** — the multi-step workflow
- **Result** — what success looks like

### Three Common Skill Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Document & Asset Creation** | Creating consistent, high-quality output | `frontend-design` skill — production-grade UIs |
| **Workflow Automation** | Multi-step processes with consistent methodology | `skill-creator` — guides you through building skills |
| **MCP Enhancement** | Workflow guidance on top of MCP tool access | `sentry-code-review` — analyzes bugs in GitHub PRs using Sentry MCP |

---

## Technical Requirements

### Folder Naming Rules

```
✅ notion-project-setup    (kebab-case)
❌ Notion Project Setup    (no spaces)
❌ notion_project_setup    (no underscores)
❌ NotionProjectSetup      (no capitals)
```

### YAML Frontmatter — The Most Important Part

This is how Claude decides whether to load your skill. Minimal required format:

```yaml
---
name: your-skill-name
description: What it does. Use when user asks to [specific phrases].
---
```

**Good vs. Bad descriptions:**

```yaml
# ✅ Good - specific and actionable
description: Analyzes Figma design files and generates developer
  handoff documentation. Use when user uploads .fig files, asks
  for "design specs" or "design-to-code handoff".

# ❌ Bad - too vague
description: Helps with projects.

# ❌ Bad - missing triggers
description: Creates sophisticated multi-page documentation systems.
```

> The description field is the single most important part of your skill. It determines when Claude loads it. Include **what** it does AND **when** to use it.

### Security Notes

- No XML angle brackets (`< >`) in frontmatter 
- Skills cannot be named with "claude" or "anthropic" prefix (reserved)
- Frontmatter appears in Claude's system prompt — malicious content could inject instructions

---

## Writing Effective Instructions

The guide recommends this structure for your SKILL.md:

```markdown
---
name: your-skill
description: [...]
---

# Your Skill Name

## Instructions

### Step 1: [First Major Step]
Clear explanation of what happens.
Expected output: [describe what success looks like]

## Examples
Example 1: [common scenario]
User says: "Set up a new marketing campaign"
Actions: 1. Fetch existing campaigns via MCP ...
Result: Campaign created with confirmation link

## Troubleshooting
Error: [Common error message]
Cause: [Why it happens]
Solution: [How to fix]
```

### Best Practices

- **Be specific and actionable** — `Run python scripts/validate.py --input {filename}` beats `Validate the data`
- **Include error handling** — Document common MCP failures and recovery steps
- **Use progressive disclosure** — Keep SKILL.md under 5,000 words; move detailed docs to `references/`
- **Reference bundled resources clearly** — Link to files like `references/api-patterns.md`

---

## Testing and Iteration

Anthropic recommends three levels of testing:

### 1. Triggering Tests
Does the skill load at the right times?

```
Should trigger:
- "Help me set up a new ProjectHub workspace"
- "I need to create a project in ProjectHub"

Should NOT trigger:
- "What's the weather in San Francisco?"
- "Help me write Python code"
```

### 2. Functional Tests
Does the skill produce correct outputs?

```
Test: Create project with 5 tasks
Given: Project name "Q4 Planning", 5 task descriptions
Then:
  - Project created in ProjectHub
  - 5 tasks created with correct properties
  - No API errors
```

### 3. Performance Comparison
Prove the skill improves results vs. baseline — measure token consumption, number of back-and-forth messages, and API failures with vs. without the skill.

> **Pro Tip**: Iterate on a single challenging task until Claude succeeds, then extract the winning approach into a skill. This leverages Claude's in-context learning.

---

## Five Powerful Patterns

The guide identifies five patterns that emerged from early adopters:

### Pattern 1: Sequential Workflow Orchestration
Multi-step processes in a specific order (e.g., "Onboard New Customer" → create account → setup payment → create subscription → send welcome email).

### Pattern 2: Multi-MCP Coordination
Workflows spanning multiple services (e.g., design-to-development handoff across Figma → Google Drive → Linear → Slack).

### Pattern 3: Iterative Refinement
Output quality improves with iteration — generate draft, run quality check, refine, repeat until threshold met.

### Pattern 4: Context-Aware Tool Selection
Same outcome, different tools depending on context — large files go to cloud storage, collaborative docs to Notion, code files to GitHub.

### Pattern 5: Domain-Specific Intelligence
Adding specialized knowledge beyond tool access — e.g., financial compliance checks before processing payments.

---

## Distribution & Sharing

### Current Model (January 2026)

**For individuals:**
1. Download the skill folder
2. Zip it
3. Upload to Claude.ai → Settings → Capabilities → Skills

**For organizations:**
- Admins can deploy skills workspace-wide (shipped December 2025)
- Automatic updates & centralized management

**Via API:**
- `/v1/skills` endpoint for listing and managing skills
- Add skills to Messages API requests via `container.skills` parameter
- Works with the Claude Agent SDK for building custom agents

### An Open Standard

> Anthropic has published Agent Skills as an open standard. Like MCP, skills are designed to be portable across tools and platforms.

### Positioning Your Skill

Focus on **outcomes, not features**:

```
✅ "The ProjectHub skill enables teams to set up complete project
   workspaces in seconds — instead of spending 30 minutes on manual setup."

❌ "The ProjectHub skill is a folder containing YAML frontmatter
   and Markdown instructions that calls our MCP server tools."
```

---

## Troubleshooting Quick Reference

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| "Could not find SKILL.md" | Wrong filename | Must be exactly `SKILL.md` (case-sensitive) |
| "Invalid frontmatter" | YAML formatting | Check `---` delimiters, unclosed quotes |
| "Invalid skill name" | Spaces or capitals | Use kebab-case only |
| Skill doesn't trigger | Vague description | Add specific trigger phrases |
| Skill triggers too often | Description too broad | Add negative triggers, be more specific |
| MCP calls fail | Connection issue | Verify MCP server status, check API keys |
| Instructions not followed | Too verbose or buried | Be concise, put critical instructions at top |
| Slow/degraded responses | Context too large | Keep SKILL.md under 5,000 words |

> **Advanced technique**: For critical validations, bundle a script that performs checks programmatically. Code is deterministic; language interpretation isn't.

---

## Quick Start Checklist

**Before you start:**
- [ ] Identified 2–3 concrete use cases
- [ ] Tools identified (built-in or MCP)
- [ ] Reviewed example skills

**During development:**
- [ ] Folder named in kebab-case
- [ ] `SKILL.md` exists (exact spelling)
- [ ] YAML frontmatter has `---` delimiters
- [ ] `description` includes WHAT and WHEN
- [ ] No XML tags anywhere
- [ ] Instructions are clear and actionable
- [ ] Error handling included

**Before upload:**
- [ ] Tested triggering on obvious tasks
- [ ] Tested triggering on paraphrased requests
- [ ] Verified doesn't trigger on unrelated topics
- [ ] Functional tests pass

---

## Key Takeaway

Skills are the "teach once, benefit forever" layer for Claude. Whether you're building standalone workflows, enhancing MCP integrations, or standardizing how your team uses Claude, skills turn ad-hoc prompting into consistent, reliable automation. Start with the [skill-creator skill](https://github.com/anthropics/skills) — you can build and test your first skill in 15–30 minutes.



**Resources:**
- [Skills Documentation](https://docs.anthropic.com)
- [Example Skills Repository](https://github.com/anthropics/skills)
- [MCP Documentation](https://docs.anthropic.com)
- [Anthropic Blog: Introducing Agent Skills](https://www.anthropic.com/blog)
