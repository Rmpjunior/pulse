# Runbook

## Prerequisites

- Node.js 20+
- PostgreSQL (local or managed)
- `.env.local` configured (see `ENV_SETUP.md`)

## Local Setup

```bash
npm install
npx prisma db push
npm run dev
```

App URL: `http://localhost:3000`

## Useful Commands

```bash
# Lint
npm run lint

# Build
npm run build

# Prisma studio
npx prisma studio
```

## Core Manual Test Flows

1. Auth flow:
   - register user
   - login
   - logout
2. Editor flow:
   - create page
   - add/edit/reorder/delete block
   - save theme
   - publish/unpublish
3. Public flow:
   - open `/p/{username}`
   - click link block and verify analytics updates

## Deployment

- Connected to Vercel with automatic build/deploy.
- Before merge/deploy:
  - run `npm run lint`
  - run `npm run build`
  - smoke-test auth + editor + public page

## Gate de saída documental (`Quality Check (docs)`)

Use este gate **antes de encerrar qualquer sessão com alteração de código/docs**:

- Confirmar que links operacionais alterados continuam válidos.
- Confirmar PT-BR em qualquer texto novo de UI/documentação.
- Registrar `yes/no` no campo `Quality Check (docs)` em `docs/04_SESSION_LOG.md`.

Se algum item estiver `no`, não encerrar sessão como concluída: corrigir ou registrar bloqueio explícito.

<a id="language-audit-checklist"></a>

> Convenção de âncoras internas: usar IDs ASCII explícitos para seções linkadas pelo hub (evitar dependência de slug automático com acentos).

## Checklist rápido de auditoria de idioma (novos docs)

Aplicar ao criar/editar documentação:

- [ ] Documento operacional está em PT-BR.
- [ ] Se conteúdo técnico ficou em EN, há justificativa curta (clareza técnica/terminologia).
- [ ] Não há mistura PT-BR/EN no mesmo bullet sem necessidade.
- [ ] Links/âncoras continuam válidos após ajustes de idioma.
- [ ] Atualização refletida em `docs/02_CURRENT_STATE.md` e `docs/03_BACKLOG.md` quando aplicável.

## Troubleshooting

- Prisma connection issues:
  - verify `DATABASE_URL`
  - run `npx prisma db push`
- Auth issues:
  - verify `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Google auth vars
- Unexpected runtime state:
  - check browser console
  - check Vercel function logs
  - verify latest schema is applied
