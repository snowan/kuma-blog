# Kuma Blog lab-note runbook

Use a lab note when the reader needs inspectable evidence from an experiment,
evaluation, trace, implementation trial, or operational runbook. Use an essay
when the main contribution is synthesis or argument.

## Pair the note with evidence

A public lab note belongs under `src/content/lab-notes/<topic>/`. A reproducible
artifact may live under `labs/experiments/<slug>/` after exact review. The note
must stand on its own and link only privacy-safe artifacts.

Recommended artifact contents:

```text
labs/experiments/<slug>/
├── README.md          # question, environment, command, limitations
├── fixtures/          # synthetic or explicitly public inputs
├── src/               # minimal runnable experiment
└── results/           # raw observations plus derivation notes
```

## Minimum report

Document:

- hypothesis and failure condition;
- exact model, harness, tool, environment, and configuration versions;
- tasks, sample selection, controls, and scoring rubric;
- raw observations before aggregate metrics;
- human interventions and recovery attempts;
- expected versus observed outcomes;
- limitations, confounders, and missing evidence;
- the next test most likely to disprove or refine the conclusion.

Do not invent benchmark results, production scale, terminal output, telemetry,
or personal experience. Label a synthetic example as synthetic. Separate model
output quality from whether the environment reached the requested state.

## Presentation and review

Use Control Room for most evals, traces, and runbooks. Paper Journal remains
appropriate for a research synthesis; Mori Notebook is appropriate for a
personal learning journey with evidence. Presentation does not change the
metadata, source, privacy, or publication gates.

Run the local draft preview and the complete production verification from the
publishing runbook. Publication still requires explicit authorization for the
exact lab-note path.

Existing applications under `AI/kuma-ai-agents/` remain in place. Moving them
to `labs/` or dedicated repositories requires a separate ADR that preserves
tests, CI paths, environment examples, and rollback.

