# Kuma Blog publication and discovery ledger

- Date: 2026-08-21
- Inventory base: `f2629d999bb5bfaef91e059c54926380a2061f6a`
- Authorization: explicit user approval in the publication task
- Deployment target: `https://snowan.github.io/kuma-blog/`

## Canonical publication paths

The following reviewed entries change from `draft` to `published`:

1. `src/content/writing/agents-harnesses/demystifying-agent-harness.mdx`
2. `src/content/writing/agents-harnesses/how-to-build-agent-harness.mdx`
3. `src/content/writing/evals-reliability/agent-evals-that-diagnose-failure.mdx`
4. `src/content/writing/inference-systems/llm-admission-control.mdx`
5. `src/content/writing/inference-systems/llm-serving-control-plane.mdx`
6. `src/content/writing/memory-context/agent-memory-deep-dive.mdx`
7. `src/content/writing/memory-context/agent-memory-survey.mdx`
8. `src/content/writing/memory-context/context-engineering.mdx`
9. `src/content/writing/memory-context/filesystem-context-engineering.mdx`
10. `src/content/visuals/agents-harnesses/agent-harness-control-loop.mdx`
11. `src/content/visuals/memory-context/agent-memory-learning-series.mdx`

## Legacy library paths

[`src/data/legacy-posts.json`](../../src/data/legacy-posts.json) is the exact
172-path publication ledger. Every entry records its source path, stable site
slug, inferred collection and technical topics, word count, and SHA-256 digest.
The build fails when that ledger is stale, so a new or changed legacy document
cannot enter the site without a reviewed manifest update.

The approved legacy scope contains:

| Collection | Posts |
| --- | ---: |
| Algorithms | 95 |
| AI, agents, and systems | 55 |
| Visual learning | 10 |
| Books and readings | 5 |
| Personal notes | 4 |
| Engineering notes | 3 |
| **Total** | **172** |

## Explicit exclusions

- 104 support or operational Markdown documents;
- the four content-schema fixtures that remain drafts;
- two zero-byte placeholders;
- prompts, storyboards, character sheets, source-only notes, and generated intermediates;
- application source code and untracked dependency archives.

## URL and editorial behavior

- Canonical entries keep `/writing/` and `/visuals/` routes and appear in topic
  pages, Pagefind search, RSS, and the sitemap.
- Legacy entries render below `/library/<legacy-slug>/`, appear in the complete
  post directory, Pagefind search, relevant topic indexes, and the sitemap.
- Legacy pages carry a visible preservation notice and link to the exact source
  Markdown. They do not claim compliance with the current editorial standard.
- Relative images use the public repository source; relative links prefer an
  internal library route when the target is approved and otherwise use GitHub.
- The existing GitBook remains linked as a compatibility archive.

## Rollback

Revert the publication commit. This restores the 11 draft statuses, removes the
library routes and manifest, and causes the Pages workflow to deploy the prior
curated shell. No legacy source path is moved, edited, or deleted by this change.
