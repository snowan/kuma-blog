# 12 Ways to Customize Claude Code — Boris Cherny's Latest Guide

## Metadata
- **Created:** 2026-02-11
- **Author:** Boris Cherny (@bcherny), Creator of Claude Code
- **Source:** [X Thread](https://x.com/bcherny/status/2021699851499798911)
- **Date:** February 2026

## TL;DR
Boris Cherny, the creator of Claude Code, shares a 12-part thread on the deep customizability of Claude Code — from terminal themes and effort levels to custom agents, hooks, sandboxing, and spinner verbs. The core message: **every engineer uses their tools differently**, and Claude Code was built from the ground up to be incredibly configurable. Check your `settings.json` into git so your whole team benefits.

![12 Ways to Customize Claude Code — Infographic](./resources/cc-customization-infographic.png)

---

## Why Customization Matters

Boris sets the stage with a clear philosophy:

> "Reflecting on what engineers love about Claude Code, one thing that jumps out is its customizability: hooks, plugins, LSPs, MCPs, skills, effort, custom agents, status lines, output styles, etc."

> "Every engineer uses their tools differently. We built Claude Code from the ground up to not just have great defaults, but to also be incredibly customizable. This is a reason why developers fall in love with the product, and why Claude Code's growth continues to accelerate."

**My Take:** This is a refreshing design philosophy. Most tools optimize for one "right way." Claude Code bets on *flexibility* — and that bet is clearly paying off.

---

## 1. Configure Your Terminal

> **Theme:** Run `/config` to set light/dark mode.
> **Notifications:** Enable notifications for iTerm2, or use a custom notifs hook.
> **Newlines:** If you use Claude Code in an IDE terminal, Apple Terminal, Warp, or Alacritty, run `/terminal-setup` to enable shift+enter for newlines.
> **Vim mode:** Run `/vim`.

**My Take:** Small terminal tweaks compound over time. The `/terminal-setup` command is especially useful if you've been frustrated typing `\` for newlines in non-standard terminals.

---

## 2. Adjust Effort Level

> "Run `/model` to pick your preferred effort level. Set it to Low for less tokens & faster responses, Medium for balanced behavior, or High for more tokens & more intelligence."

> "Personally, I use High for everything."

**My Take:** Boris going full **High** for everything speaks volumes. If the creator trusts the model at max effort, so should you — at least for complex tasks where quality matters more than speed.

---

## 3. Install Plugins, MCPs, and Skills

> "Plugins let you install LSPs (now available for every major language), MCPs, skills, agents, and custom hooks."

> "Install a plugin from the official Anthropic plugin marketplace, or create your own marketplace for your company. Then, check the `settings.json` into your codebase to auto-add the marketplaces for your team."

Run `/plugin` to get started.

**My Take:** The plugin marketplace is a game-changer for teams. Being able to create a *company-specific marketplace* and distribute it via `settings.json` in your repo means you can standardize tooling across an entire engineering org with zero friction.

---

## 4. Create Custom Agents

> "To create custom agents, drop `.md` files in `.claude/agents`. Each agent can have a custom name, color, tool set, pre-allowed and pre-disallowed tools, permission mode, and model."

> "There's also a little-known feature in Claude Code that lets you set the default agent used for the main conversation. Just set the `agent` field in your `settings.json` or use the `--agent` flag."

Run `/agents` to get started.

**My Take:** Custom agents are where Claude Code becomes truly personal. Imagine having one agent tuned for code review, another for debugging, and a third for documentation — each with its own permissions and personality. The `.claude/agents` directory pattern is elegant and version-controllable.

---

## 5. Pre-Approve Common Permissions

> "Claude Code uses a sophisticated permission system with a combo of prompt injection detection, static analysis, sandboxing, and human oversight."

> "Out of the box, we pre-approve a small set of safe commands. To pre-approve more, run `/permissions` and add to the allow and block lists. Check these into your team's `settings.json`."

> "We support full wildcard syntax. Try `Bash(bun run *)` or `Edit(/docs/**)`."

**My Take:** The wildcard permission syntax is powerful. `Edit(/docs/**)` alone could save dozens of approval clicks per session for documentation-heavy workflows. The key is committing these to your team's `settings.json` so everyone benefits.

---

## 6. Enable Sandboxing

> "Opt into Claude Code's open source sandbox runtime to improve safety while reducing permission prompts."

> "Run `/sandbox` to enable it. Sandboxing runs on your machine, and supports both file and network isolation."

Sandbox runtime: [github.com/anthropic-experimental/sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime)

**My Take:** This is the best of both worlds — more safety *and* fewer interruptions. If you're running with liberal permissions (like the "YOLO" crowd), sandboxing is the responsible way to maintain speed without sacrificing security.

---

## 7. Add a Status Line

> "Custom status lines show up right below the composer, and let you show model, directory, remaining context, cost, and pretty much anything else you want to see while you work."

> "Everyone on the Claude Code team has a different statusline. Use `/statusline` to get started, to have Claude generate a statusline for you based on your `.bashrc`/`.zshrc`."

**My Take:** The fact that *every team member has a different status line* perfectly illustrates the customization ethos. Context usage and cost tracking in particular are practical additions that help you manage long sessions.

---

## 8. Customize Your Keybindings

> "Did you know every key binding in Claude Code is customizable? `/keybindings` to re-map any key. Settings live reload so you can see how it feels immediately."

Learn more: [code.claude.com/docs/en/keybindings](https://code.claude.com/docs/en/keybindings)

**My Take:** Live-reloading keybindings is a small but thoughtful detail. Being able to instantly feel whether a new binding works — without restarting — removes all friction from experimentation.

---

## 9. Set Up Hooks

> "Hooks are a way to deterministically hook into Claude's lifecycle. Use them to automatically route permission requests to Slack or Opus, nudge Claude to keep going when it reaches the end of a turn, or pre-process/post-process tool calls to add your own logging."

**My Take:** Hooks are the power-user feature. Routing permission requests to Slack means your team can approve actions asynchronously. The "nudge to keep going" hook is interesting — it essentially lets you build autonomous loops with a human-defined stopping condition.

---

## 10. Customize Your Spinner Verbs

> "It's the little things that make CC feel personal. Ask Claude to customize your spinner verbs to add or replace the default list with your own verbs. Check the `settings.json` into source control to share verbs with your team."

**My Take:** This is pure personality. It's cosmetic, but it changes how the tool *feels*. Shared spinner verbs checked into source control could become a fun team culture artifact.

---

## 11. Use Output Styles

> "Run `/config` and set an output style to have Claude respond using a different tone or format."

> "We recommend enabling the 'explanatory' output style when getting familiar with a new codebase, to have Claude explain frameworks and code patterns as it works."

> "Or use the 'learning' output style to have Claude coach you through making code changes."

**My Take:** Output styles are underrated. "Explanatory" mode for onboarding onto a new codebase is brilliant — it turns Claude from a coder into a *teacher* who explains the "why" as it works. "Learning" mode takes it further by coaching you through changes rather than doing them for you.

---

## 12. Customize All the Things!

> "Claude Code is built to work great out of the box. When you do customize, check your `settings.json` into git so your team can benefit, too."

> "We support configuring for your codebase, for a sub-folder, for just yourself, or via enterprise-wide policies."

> "Pick a behavior, and it is likely that you can configure it. We support **37 settings** and **84 env vars** (use the `env` field in your `settings.json` to avoid wrapper scripts)."

**My Take:** 37 settings and 84 environment variables — that's a staggering amount of configurability. The layered scope (codebase → sub-folder → personal → enterprise) mirrors how mature tools like Git handle configuration. This is enterprise-ready customization.

---

## Key Takeaways

1. **Start simple, customize as you go** — Claude Code works great out of the box; add customization as pain points emerge
2. **Check `settings.json` into git** — Team-wide benefits with zero distribution friction
3. **Use High effort for complex work** — Even the creator runs on High for everything
4. **Install plugins for your stack** — LSPs, MCPs, and skills extend Claude Code's capabilities dramatically
5. **Custom agents are the power move** — Drop `.md` files in `.claude/agents` for specialized workflows
6. **Sandbox for safety** — More security with fewer permission prompts
7. **Hooks for automation** — Route approvals to Slack, auto-continue turns, add logging
8. **Output styles for learning** — Switch to "explanatory" or "learning" mode when onboarding

---

## Quick Reference

| Feature | Command | What It Does |
|---------|---------|--------------|
| Theme | `/config` | Set light/dark mode |
| Effort | `/model` | Choose Low/Medium/High |
| Plugins | `/plugin` | Install LSPs, MCPs, skills |
| Agents | `/agents` | Create custom agents |
| Permissions | `/permissions` | Pre-approve commands |
| Sandbox | `/sandbox` | Enable file/network isolation |
| Status Line | `/statusline` | Customize composer status bar |
| Keybindings | `/keybindings` | Remap any key |
| Vim Mode | `/vim` | Enable vim keybindings |
| Output Style | `/config` | Set response tone/format |
| Terminal | `/terminal-setup` | Fix newlines in IDE terminals |

---

*Boris Cherny is the creator of Claude Code at Anthropic. This post summarizes his 12-part X thread on customization.*

**Original thread:** [@bcherny on X](https://x.com/bcherny/status/2021699851499798911) — February 2026
