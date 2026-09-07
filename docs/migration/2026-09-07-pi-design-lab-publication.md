# Pi Design Lab publication

The user requested a PR for the completed Pi lesson in Kuma Blog and to open it
on GitHub Pages. This publication adds one reviewed visual entry:
`src/content/visuals/memory-context/pi-design-lab.mdx` (`status: published`).

- Introduction: `/kuma-blog/visuals/pi-design-lab/`
- Interactive course: `/kuma-blog/learn/pi-design-lab/`
- Public assets: `public/learn/pi-design-lab/`
- Original conceptual SVG: `src/assets/articles/pi-design-lab/pi-design-map.svg`

The introductory entry supplies navigation, tags, RSS and search discovery.
The standalone course is added to the sitemap and links back to the blog.
Existing Codex and agent-memory introductions are related reading with distinct
outcomes; no existing content is deleted or reclassified.

The course's application script and structural dataset projection are unchanged
from the locally reviewed lesson. The publication copy adds canonical and social
metadata and a blog backlink. Public companion notes omit local tool logs and
workspace paths. Only structural fields of public session samples are included;
no original prompts, thinking text, or tool output bodies are republished.

## Validation

- `pnpm verify` passed: 1,915 teaching-model/structure assertions, manifest,
  Astro/type checks, contrast, build, Pagefind, generated link and canonical
  checks, and the production draft-exclusion build. 504 generated files passed.
- `pnpm audit --prod`: no known vulnerabilities.
- Built preview under `/kuma-blog/`: homepage and introduction had no horizontal
  overflow at 320 and 1440px. Course overview passed those widths in all three
  presentations. Existing shared article templates were not changed.
- Keyboard Enter followed the introduction's course link. Course autoplay reached
  its endpoint; replay and single-step produced 02/05 paused. Browser console
  had no warnings/errors during the publication checks.
- Source review preserves reduced motion and no-JS fallback. Broader lesson
  checks and unverified export/reset behavior are described in the public
  validation note; no upstream Pi runtime or provider tests were run.

Local checks are not evidence of deployment. After merging, verify Site CI and
Pages on the exact merge SHA, hosted routes, discovery and a known draft 404.
Reverting the publication commit removes this entry and its assets.
