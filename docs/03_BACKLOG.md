# Backlog

Status legend: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`

## P0 (Reliability)

| ID | Status | Task | Why |
|---|---|---|---|
| P0-1 | DONE | Add request validation (zod) to page/block/auth APIs | Prevent malformed data and runtime errors |
| P0-1.1 | DONE | Restore green build/lint gates after validation rollout | Prevent failed Vercel deploys |
| P0-2 | TODO | Add centralized API error shape and error helper | Make client handling consistent |
| P0-3 | TODO | Add minimal test baseline for critical flows | Reduce regressions |
| P0-4 | TODO | Ensure ownership checks are consistent in all mutating APIs | Security/data isolation |

## P1 (Product Quality)

| ID | Status | Task | Why |
|---|---|---|---|
| P1-1 | TODO | Complete `CATALOG` block edit/render path | Close feature gap |
| P1-2 | TODO | Complete `FORM` block edit/render path | Close feature gap |
| P1-3 | TODO | Improve analytics visitor identification strategy | Better data quality |
| P1-4 | TODO | Add optimistic UI + toasts in editor | Better UX feedback |

## P2 (Growth / Monetization)

| ID | Status | Task | Why |
|---|---|---|---|
| P2-1 | TODO | Define subscription gating matrix in code | Prepare premium flows |
| P2-2 | TODO | Implement Stripe checkout + webhook skeleton | Monetization foundation |
| P2-3 | TODO | Add custom domain/subdomain implementation plan to code backlog | Align with business plan |

## Task Update Rules

- Move one task to `IN_PROGRESS` per session.
- Mark `DONE` only after code + validation + docs update.
- If blocked, add blocker reason and dependency in `docs/04_SESSION_LOG.md`.
