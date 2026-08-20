# Technical Debt Remediation Tracker

Audit: [2026-02-07](../technical-debt/audit-2026-02-07.md)

> Historical plan. The source audit describes the repository as it existed on
> 2026-02-07. Since then, the Telegram bot gained `pyproject.toml`, pytest
> coverage, CI, Dependabot, and patched direct dependencies. Re-audit remaining
> application debt before executing an old phase; do not treat the table below
> as confirmed current state.

## Phases

| Phase | Branch | Status | Issues Addressed |
|-------|--------|--------|-----------------|
| 0 | master | Done | Save audit report |
| 1 | fix/gitignore-and-security | Pending | H1, H2, H8 |
| 2 | feat/python-project-config | Pending | H3 |
| 3 | feat/test-coverage | Pending | C2, M1-M5 |
| 4 | feat/ci-cd | Pending | C1, M6 |
| 5 | fix/dependency-updates | Pending | C3 |
| 6 | feat/logging-and-errors | Pending | H4, H5, H6 |
| 7 | refactor/separation-of-concerns | Pending | H7, M7, M8, M9 |
