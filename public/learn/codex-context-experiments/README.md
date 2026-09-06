# Codex Context Lab

A Chinese interactive course about Codex experimental context management.

- [Start the interactive course](https://snowan.github.io/kuma-blog/learn/codex-context-experiments/)
- [Read the Kuma Blog introduction](https://snowan.github.io/kuma-blog/visuals/codex-context-experiments/)
- Tags: [AI](https://snowan.github.io/kuma-blog/tags/ai/), [Agents](https://snowan.github.io/kuma-blog/tags/agents/), [Context compaction](https://snowan.github.io/kuma-blog/tags/context-compaction/)
- Published and last verified: 2026-09-06.

## Seven lessons

1. Separate working context, notes, history, and environment.
2. Compare rolling summaries, linked summaries, and the Codex experiment.
3. Play, pause, and replay a context-window transition.
4. Write recovery notes within a simulated capacity.
5. Search history and inspect the evidence behind a message ID.
6. Explore activation conditions and recovery failures.
7. Reconstruct the flow, apply it to a new scenario, and export your notes.

The suggested study time is 35 minutes. Each chapter has a checkable exercise;
reading alone does not count as passing. Teach-back text is for self-review,
not automatically graded by a model.

## Local use

The course needs only `index.html`, `styles.css`, and `app.js`, with `sources.md`
and this guide for reference. Download this directory, open `index.html`, or
run `python3 -m http.server 8769` from inside it.

The page has no external fonts, model API calls, analytics, or account sign-in.
Progress and teach-back text stay in browser localStorage. Export generates a
Markdown file in the browser. Storage failure does not prevent learning.

## Evidence and limitations

See [the source ledger](./sources.md). Technical claims refer to OpenAI's public
documentation and Codex commit `6af345407d9c2a568da9d01b6c4b81a9e61495c0`.
The lesson data, window budget, note capacity, and PASS / FAIL examples are
synthetic teaching material, not real task telemetry or measured performance.

Browser checks covered lesson interactions, feedback, saved progress, keyboard
access, three reading styles, and desktop / 390 px / 320 px layouts. Reduced
motion and no-JavaScript behavior were inspected in source; OS-level motion
emulation was not part of that browser pass. No provider-backed A/B experiment
or Codex Rust test suite was run.
