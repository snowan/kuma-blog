# Kuma Blog studio

`studio/` is the non-publication workspace for drafts, research support,
prompts, storyboards, and generated intermediates. It is excluded from the
generated site, but the Git repository is public: this directory is not a
privacy boundary.

## Intended structure

```text
studio/
├── inbox/
├── drafts/
├── research/
├── source-ledgers/
├── prompts/
├── storyboards/
└── generated/
```

The existing visual and research roots remain in place until an exact owner,
role, provenance, and license ledger approves a migration batch.

## Rules

- Store only material that is safe in a public repository.
- Keep source claims, author synthesis, and open questions distinct.
- Record provenance and license for source images and documents.
- Treat prompts, character sheets, raw generations, and alternates as support
  material, not finished articles.
- Never commit secrets, credentials, cookies, auth tokens, private data,
  copyrighted source dumps, or internal-only evidence.
- Delete generated material only after exact-path review and approval.

Promotion into `src/content/` requires a defined reader outcome, editorial and
source review, safe assets, validated metadata, local visual review, and
explicit publication approval.

