# Agent Start Here

This file is the operating contract for any AI coding agent working on Pulse.

## Session Workflow (Mandatory)

1. Read:
   - `docs/01_PRODUCT_BRIEF.md`
   - `docs/02_CURRENT_STATE.md`
   - `docs/03_BACKLOG.md`
   - last entries in `docs/04_SESSION_LOG.md`
2. Choose the top backlog item not blocked.
3. Implement in small verifiable steps.
4. Run checks (at minimum lint + relevant runtime check).
5. Update docs:
   - mark backlog item status
   - append a new session entry in `docs/04_SESSION_LOG.md`
   - update `docs/02_CURRENT_STATE.md` if behavior changed

## Non-Negotiable Rules

- Do not invent scope beyond `docs/01_PRODUCT_BRIEF.md` without adding an explicit backlog item first.
- Keep changes backwards compatible unless explicitly planned.
- Prefer small commits/PRs with one clear objective.
- Every behavior change must include:
  - affected files
  - risk notes
  - manual validation steps

## Definition of Done (Per Task)

- Code compiles.
- Lint passes.
- Runtime path manually validated.
- Docs updated (`02_CURRENT_STATE`, `03_BACKLOG`, `04_SESSION_LOG`).

## Owner Context

The product owner is non-technical. Output should always include:

- What changed (plain language)
- Why it matters
- What to test
- What is next
