# Pulse Documentation Hub

This folder has two documentation layers:

1. `Operational docs` for day-to-day execution by AI agents and humans.
2. `Reference docs` for architecture/features/API/database details.

## Operational Docs (Primary)

> **Gate documental obrigatório:** antes de encerrar sessão com mudanças, preencher `Quality Check (docs)` no `docs/04_SESSION_LOG.md` (links revisados + PT-BR confirmado).

- `docs/00_AGENT_START_HERE.md`: Fluxo obrigatório para cada sessão de desenvolvimento
- `docs/01_PRODUCT_BRIEF.md`: Objetivos do produto, usuários e restrições
- `docs/02_CURRENT_STATE.md`: O que está implementado hoje vs. o que falta (inclui guardrail ativo de idioma PT-BR)
- `docs/03_BACKLOG.md`: Fila priorizada de trabalho (ver `P2-10` para regra de bloqueio de textos em inglês)
- `docs/04_SESSION_LOG.md`: Registro de sessões e template operacional (atalho: `docs/04_SESSION_LOG.md#template` + `docs/04_SESSION_LOG.md#quality-check-docs`)
- `docs/05_RUNBOOK.md`: Instruções para executar, testar, deployar e resolver problemas (atalho: `docs/05_RUNBOOK.md#language-audit-checklist`)
- `docs/06_OPENCLAW_SETUP.md`: Requisitos e permissões para sessões com OpenClaw
- `docs/07_FEATURE_PARITY_MATRIX.md`: Matriz oficial de paridade Keepo → Pulse + critérios de aceite
- `docs/08_CUSTOM_DOMAIN_PLAN.md`: Plano técnico para suporte a domínio/subdomínio customizado
- `docs/09_GOOGLE_AUTH_PRODUCTION_CHECKLIST.md`: Checklist de produção + validação ponta a ponta do Google OAuth
- `docs/10_FRONTEND_QUALITY_PLAYBOOK.md`: Playbook de qualidade frontend aplicado no P4-2 (`skills.sh`)
- `docs/11_VISUAL_ASSET_AUDIT_PROMPTS.md`: Auditoria visual (landing/app) + prompts prontos para geração externa de assets

## Reference Docs (Secondary)

> **Política de idioma (decisão):** docs operacionais em PT-BR; docs de referência técnica podem permanecer em EN quando o conteúdo for mais estável/estrutural.

- `docs/FEATURES.md` (EN técnico permitido)
- `docs/ARCHITECTURE.md` (EN técnico permitido)
- `docs/DATABASE.md` (EN técnico permitido)
- `docs/API.md` (EN técnico permitido)

Use operational docs first to avoid context drift.
