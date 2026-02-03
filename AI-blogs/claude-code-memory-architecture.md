# Deep Dive: Claude Code Memory Architecture

**Source**: [Claude Code GitHub](https://github.com/anthropics/claude-code) | [Official Docs](https://docs.anthropic.com/en/docs/claude-code/memory)  
**Author**: System Analysis  
**Date**: February 2, 2026

---

## Executive Summary

Claude Code's memory system is a sophisticated, hierarchical architecture designed to provide context persistence across sessions while maintaining flexibility for both individual developers and enterprise organizations. Unlike simple configuration systems, it implements a **four-tier inheritance model** that balances organizational control with personal customization.

This deep dive analyzes the core design principles, data flow, and architectural patterns that make Claude Code's memory system unique among AI coding assistants.

---

## Table of Contents

1. [Core Architecture Overview](#core-architecture-overview)
2. [The Four-Tier Memory Hierarchy](#the-four-tier-memory-hierarchy)
3. [CLAUDE.md: The Central Memory Unit](#claudemd-the-central-memory-unit)
4. [Modular Rules System](#modular-rules-system)
5. [Memory Imports and Composition](#memory-imports-and-composition)
6. [Skills: Procedural Memory](#skills-procedural-memory)
7. [Subagents: Memory Isolation](#subagents-memory-isolation)
8. [Configuration Scopes Deep Dive](#configuration-scopes-deep-dive)
9. [Design Patterns & Best Practices](#design-patterns--best-practices)
10. [Comparison with Other AI Coding Tools](#comparison-with-other-ai-coding-tools)

---

## Core Architecture Overview

Claude Code's memory architecture follows a **layered context injection** model. At its heart, the system solves a fundamental challenge in AI-assisted development: how to make an LLM remember and apply project-specific knowledge session after session, while respecting organizational policies and personal preferences.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Claude Code Memory Stack                      │
├─────────────────────────────────────────────────────────────────┤
│  Layer 4: Managed (Organization)                                │
│  ├── /Library/Application Support/ClaudeCode/CLAUDE.md (macOS) │
│  ├── /etc/claude-code/CLAUDE.md (Linux)                        │
│  └── C:\Program Files\ClaudeCode\CLAUDE.md (Windows)           │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: User (Personal Global)                                │
│  ├── ~/.claude/CLAUDE.md                                        │
│  └── ~/.claude/rules/*.md                                       │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Project (Team Shared)                                 │
│  ├── ./CLAUDE.md                                                │
│  ├── ./.claude/CLAUDE.md                                        │
│  └── ./.claude/rules/*.md                                       │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Local (Personal Project)                              │
│  └── ./CLAUDE.local.md                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Cascading Inheritance**: Each layer inherits from but can override the layer above
2. **Separation of Concerns**: Different memory types serve different purposes (rules, skills, agents)
3. **Git-First Design**: Project memories are designed for version control integration
4. **Composability**: Memory files can import other files using the `@path` syntax

---

## The Four-Tier Memory Hierarchy

Claude Code uses a **five-level precedence system** for configuration (including command-line arguments), but for persistent memory files, there are four tiers:

### Tier 1: Managed Memory (Highest Priority)

**Purpose**: Organization-wide policies that cannot be overridden by individuals.

| Platform | Location |
|----------|----------|
| macOS | `/Library/Application Support/ClaudeCode/` |
| Linux/WSL | `/etc/claude-code/` |
| Windows | `C:\Program Files\ClaudeCode\` |

This tier supports:
- `CLAUDE.md` - Organization instructions
- `managed-settings.json` - Enforced configurations
- `managed-mcp.json` - Managed MCP server configurations

**Use Cases**:
- Security compliance requirements
- Standardized tooling and workflows
- Corporate branding guidelines
- Audit trail requirements

### Tier 2: User Memory (Personal Global)

**Location**: `~/.claude/`

This is your personal "home base" for Claude Code customization:

```
~/.claude/
├── CLAUDE.md           # Personal global instructions
├── settings.json       # User preferences
├── rules/              # Personal rule files
│   ├── preferences.md
│   └── workflows.md
├── skills/             # Personal skills
│   └── my-skill/SKILL.md
└── agents/             # Personal subagents
    └── my-agent.md
```

### Tier 3: Project Memory (Team Shared)

**Location**: Project root (`.claude/` or `./`)

This tier is designed for **version control**:

```
your-project/
├── CLAUDE.md                    # Project root instructions
├── .claude/
│   ├── CLAUDE.md               # Alternative location for main instructions
│   ├── settings.json           # Team settings (committed)
│   ├── settings.local.json     # Personal overrides (gitignored)
│   └── rules/                  # Modular rule files
│       ├── code-style.md
│       ├── testing.md
│       └── security.md
└── packages/
    └── frontend/
        └── CLAUDE.md           # Subdirectory-specific instructions
```

**Key Features**:
- Subdirectory-aware: Claude automatically loads `CLAUDE.md` from child directories when working in them
- Parent directory traversal: Memories are loaded from parent directories up to the project root
- Git-friendly separation: `settings.json` for team, `settings.local.json` for individuals

### Tier 4: Local Memory (Personal Override)

**File**: `./CLAUDE.local.md`

A special file for personal project overrides that should never be committed. Claude Code automatically configures git to ignore this file.

> **Note**: While called "Tier 4", local memory files actually **override** project memory. The precedence from highest to lowest is: **Managed → Command Line → Local → Project → User**.

---

## CLAUDE.md: The Central Memory Unit

The `CLAUDE.md` file is the **primary interface** for memory storage in Claude Code. It uses natural language markdown with optional structured elements.

### Anatomy of an Effective CLAUDE.md

```markdown
# Project: My Application

## Overview
This is a Next.js 14 application using TypeScript and Tailwind CSS.

## Key Commands
- `npm run dev` - Start development server
- `npm run test` - Run Jest tests
- `npm run lint` - ESLint with auto-fix

## Code Style Preferences
- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible
- Prefer functional components with hooks

## Architecture Decisions
- API routes use `/api/v1/` prefix
- Authentication via JWT stored in httpOnly cookies
- Database: PostgreSQL with Prisma ORM

## Workflow Notes
- Run single tests for speed, not full suite
- Always typecheck before committing
- Use conventional commits format
```

### What to Include

| Category | Examples |
|----------|----------|
| **Commands** | Build, test, lint, deploy scripts |
| **Conventions** | Naming patterns, file organization, code style |
| **Architecture** | Tech stack, patterns, key abstractions |
| **Gotchas** | Known issues, workarounds, things to avoid |
| **Team Practices** | Review process, branch naming, commit format |

### What NOT to Include

- Secrets or credentials (use `.env` files instead)
- Temporary debugging notes
- Information that changes frequently
- Duplicated information from README

---

## Modular Rules System

For larger projects, the `.claude/rules/` directory provides a **modular approach** to memory organization.

### Basic Structure

```
.claude/rules/
├── code-style.md      # Coding conventions
├── testing.md         # Testing guidelines
├── security.md        # Security requirements
├── frontend/          # Grouped by domain
│   ├── react.md
│   └── styles.md
└── backend/
    ├── api.md
    └── database.md
```

### Path-Specific Rules

Rules can be conditionally applied based on file paths using YAML frontmatter:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "lib/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

### Glob Pattern Support

| Pattern | Matches |
|---------|---------|
| `**/*.ts` | All TypeScript files |
| `src/**/*` | Everything under src/ |
| `*.md` | Markdown files in current dir |
| `src/**/*.{ts,tsx}` | TS and TSX in src/ |
| `{src,lib}/**/*.ts` | TS files in src/ or lib/ |

### Rule Inheritance

Rules are loaded in order:
1. All rules without `paths` frontmatter (global rules)
2. Rules matching the current file path
3. Rules from parent directories in monorepos

---

## Memory Imports and Composition

Claude Code supports **file imports** within memory files using the `@path` syntax:

```markdown
See @README.md for project overview and @package.json for npm commands.

# Additional Instructions
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

### Import Resolution

- Paths are relative to the file containing the import
- `~` expands to the user's home directory
- Backtick-wrapped `@` symbols are NOT treated as imports: `` `@anthropic-ai/claude-code` ``

### Use Cases

1. **Documentation Reuse**: Reference existing docs instead of duplicating
2. **Shared Configurations**: Import common config across projects
3. **Personal Preferences**: Layer personal preferences on team rules

---

## Skills: Procedural Memory

While `CLAUDE.md` provides **declarative knowledge** (what Claude should know), **Skills** provide **procedural knowledge** (what Claude should do).

### Skill Anatomy

```
my-skill/
├── SKILL.md           # Required: Main instructions
├── template.md        # Optional: Output template
├── examples/          # Optional: Example outputs
│   └── sample.md
└── scripts/           # Optional: Helper scripts
    └── validate.sh
```

### SKILL.md Format

```markdown
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
disable-model-invocation: false
allowed-tools: Read, Grep
context: fork
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?
```

### Skill Locations

| Scope | Path |
|-------|------|
| User | `~/.claude/skills/<skill-name>/SKILL.md` |
| Project | `.claude/skills/<skill-name>/SKILL.md` |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` |

### Skill Invocation

- **Explicit**: `/skill-name argument`
- **Automatic**: Based on task matching the skill's description
- **Imported**: Referenced from other memory files

---

## Subagents: Memory Isolation

Subagents provide **isolated execution contexts** with their own memory scopes. This is crucial for:

1. **Context Management**: Preventing context pollution in long sessions
2. **Permission Isolation**: Restricting tool access for specific tasks
3. **Parallel Execution**: Running independent tasks without interference

### Built-in Subagents

| Type | Model | Tools | Purpose |
|------|-------|-------|---------|
| Explore | haiku | Read-only | File discovery, code search, codebase exploration |
| Plan | inherit | Read-only | Codebase research for planning |
| General-purpose | inherit | All | Complex research, multi-step operations, code modifications |

### Custom Subagent Configuration

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

### Subagent Locations

```
~/.claude/agents/       # User-level agents
.claude/agents/         # Project-level agents
<plugin>/agents/        # Plugin-provided agents
```

### Foreground vs Background

| Aspect | Foreground | Background |
|--------|------------|------------|
| Blocks main conversation | Yes | No |
| Permission prompts | Pass-through to user | Pre-approved before launch; auto-denies unapproved |
| Clarifying questions (AskUserQuestion) | Pass-through to user | Tool call fails, subagent continues |
| MCP tools | Available | Not available |
| Context | Fresh | Fresh |

---

## Configuration Scopes Deep Dive

Beyond memory files, Claude Code uses a **configuration scope hierarchy** for settings:

```
Precedence (highest to lowest):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Managed         ← Cannot be overridden
2. Command Line    ← Temporary session overrides
3. Local           ← .claude/settings.local.json
4. Project         ← .claude/settings.json
5. User            ← ~/.claude/settings.json
```

### Settings File Locations

| Scope | Path | Git Tracked |
|-------|------|-------------|
| Managed | System directories | N/A (IT deployed) |
| User | `~/.claude/settings.json` | No |
| Project | `.claude/settings.json` | Yes |
| Local | `.claude/settings.local.json` | No (auto-gitignored) |

### Scope Interaction Examples

```json
// ~/.claude/settings.json (User)
{
  "permissions": {
    "allow": ["Bash(npm run lint)"]
  }
}

// .claude/settings.json (Project)
{
  "permissions": {
    "allow": ["Bash(npm run test *)"]
  }
}

// Result: Both permissions apply (merged)
// But project can't remove user permissions unless explicitly denied
```

---

## Design Patterns & Best Practices

### Pattern 1: Layered Memory Organization

```
Organization Memory (Managed)
    └── Compliance requirements
    └── Security policies
    └── Standard tooling
        ↓
Personal Defaults (~/.claude/)
    └── Editor preferences
    └── Common workflows
    └── Frequently used skills
        ↓
Project Specifics (./CLAUDE.md)
    └── Tech stack
    └── Commands
    └── Team conventions
        ↓
Personal Overrides (CLAUDE.local.md)
    └── Debugging helpers
    └── Experimental features
```

### Pattern 2: Monorepo Structure

```
monorepo/
├── CLAUDE.md                    # Root: shared conventions
├── .claude/rules/
│   └── shared-testing.md        # Cross-package test standards
├── packages/
│   ├── frontend/
│   │   └── CLAUDE.md            # Frontend-specific: React patterns
│   ├── backend/
│   │   └── CLAUDE.md            # Backend-specific: API conventions
│   └── shared/
│       └── CLAUDE.md            # Shared lib: type conventions
```

### Pattern 3: Symlinked Shared Rules

```bash
# Share rules across repositories
ln -s ~/company-standards/security.md .claude/rules/security.md

# Share entire rule directories
ln -s ~/shared-claude-rules .claude/rules/shared
```

### Best Practices Summary

| Do | Don't |
|-----|-------|
| Be specific: "Use 2-space indentation" | Vague: "Format code properly" |
| Use bullet points and headings | Write long paragraphs |
| Review and update periodically | Let memories become stale |
| Keep rules focused per file | Mix unrelated topics |
| Use descriptive filenames | Use generic names like `rules1.md` |
| Leverage path-specific rules | Apply all rules globally |

---

## Comparison with Other AI Coding Tools

| Feature | Claude Code | GitHub Copilot | Cursor | Windsurf |
|---------|-------------|----------------|--------|----------|
| **Persistent Memory** | Four-tier hierarchy | Project-level context | .cursor/rules | .windsurf/rules |
| **Organization Control** | Managed settings | Enterprise policies | Limited | Limited |
| **Import/Composition** | @path syntax | None | None | None |
| **Modular Rules** | .claude/rules/ | None | Directory rules | Cascade rules |
| **Skills System** | Full SKILL.md | None | None | None |
| **Custom Agents** | agents/*.md | None | None | Workflows |
| **Path-Specific Rules** | YAML frontmatter | None | Glob patterns | Glob patterns |

---

## Conclusion

Claude Code's memory architecture represents a thoughtful approach to the challenge of persistent context in AI-assisted development. Its key innovations include:

1. **Hierarchical inheritance** that respects organizational boundaries while enabling personal customization
2. **Composable memory** through the import system, reducing duplication
3. **Separation of declarative and procedural knowledge** through CLAUDE.md vs Skills
4. **Context isolation** via subagents, enabling clean parallel execution

The system is designed to grow with teams: from a single developer's personal preferences to enterprise-wide policies managed by IT. This flexibility, combined with git-friendly conventions, makes it particularly well-suited for professional development environments.

---

## References

- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Official Memory Documentation](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Subagents Documentation](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Settings Reference](https://docs.anthropic.com/en/docs/claude-code/settings)
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview)
