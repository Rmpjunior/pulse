# Pulse Documentation Hub

This folder has two documentation layers:

1. `Operational docs` for day-to-day execution by AI agents and humans.
2. `Reference docs` for architecture/features/API/database details.

## Operational Docs (Primary)

> **Gate documental obrigatório:** antes de encerrar sessão com mudanças, preencher `Quality Check (docs)` no `docs/04_SESSION_LOG.md` (links revisados + PT-BR confirmado).

- `docs/00_AGENT_START_HERE.md`: Mandatory workflow for each coding session
- `docs/01_PRODUCT_BRIEF.md`: Product goals, users, and constraints
- `docs/02_CURRENT_STATE.md`: What is implemented today vs missing (inclui guardrail ativo de idioma PT-BR)
- `docs/03_BACKLOG.md`: Prioritized work queue (ver `P2-10` para regra de bloqueio de textos em inglês)
- `docs/04_SESSION_LOG.md`: Session-by-session changelog template (atalho: `docs/04_SESSION_LOG.md#template` + `docs/04_SESSION_LOG.md#quality-check-docs`)
- `docs/05_RUNBOOK.md`: Run, test, deploy, and troubleshoot instructions
- `docs/06_OPENCLAW_SETUP.md`: Requirements and permissions for OpenClaw sessions
- `docs/07_FEATURE_PARITY_MATRIX.md`: Official Keepo → Pulse parity matrix + acceptance criteria
- `docs/08_CUSTOM_DOMAIN_PLAN.md`: Technical implementation plan for custom domain/subdomain support
- `docs/09_GOOGLE_AUTH_PRODUCTION_CHECKLIST.md`: Production env checklist + end-to-end validation for Google OAuth
- `docs/10_FRONTEND_QUALITY_PLAYBOOK.md`: Frontend quality playbook applied in P4-2 (`skills.sh` reference)
- `docs/11_VISUAL_ASSET_AUDIT_PROMPTS.md`: Visual audit (landing/app) + ready-to-use prompts for external AI asset generation

## Reference Docs (Secondary)

- `docs/FEATURES.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/API.md`

Use operational docs first to avoid context drift.
