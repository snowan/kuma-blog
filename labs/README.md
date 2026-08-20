# Kuma Blog labs

`labs/` is the target home for reproducible, privacy-safe experiments that
support Kuma Blog lab notes. It is not a second publication feed, and this
directory does not absorb the existing applications under
`AI/kuma-ai-agents/` without a separate architecture decision.

## Intended structure

```text
labs/
├── experiments/
│   └── <experiment-slug>/
│       ├── README.md
│       ├── fixtures/
│       ├── src/
│       └── results/
└── shared/
```

Create an experiment directory only when an exact artifact has passed review.
Do not perform a bulk move merely to match this target tree.

## Artifact contract

Every experiment must record:

- the question or falsifiable hypothesis;
- model, version, harness, tools, environment, and relevant configuration;
- task selection and scoring method;
- variables held constant and variables changed;
- raw observations separately from derived metrics;
- human interventions, failures, and recovery behavior;
- limitations and a next test;
- the linked `src/content/lab-notes/` draft, when one exists.

Use synthetic or explicitly public fixtures. Never commit credentials, tokens,
cookies, private conversations, hidden reasoning, private traces, identifying
data, or raw internal tool output. A redacted artifact must say what was removed
and how the redaction may affect interpretation.

## Publication boundary

Lab code and evidence are not automatically published by GitHub Pages. Only an
explicitly reviewed lab note under `src/content/lab-notes/` can enter the site,
and only after its status changes to `published` with explicit approval.

Before linking an artifact from a public note, confirm that it is inspectable,
licensed for public use, reproducible from documented inputs, and free of
sensitive data.

