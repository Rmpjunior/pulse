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

## Política de retenção de artefatos QA pesado (P6)

Versão atual: **v1 (2026-03-06)**

- Artefato: `p6-route-ui-smoke-logs`
  - Conteúdo: logs de startup/route-matrix/degraded/auth + screenshots de falha
  - Retenção: **7 dias**
  - Compressão: **nível 6**
  - Justificativa: balancear custo de storage e janela suficiente para triagem pós-merge

### Regra de evolução

- Mudanças de retenção/compressão devem:
  1. atualizar esta seção com nova versão (v2, v3...)
  2. registrar motivo em `docs/04_SESSION_LOG.md`
  3. atualizar `docs/02_CURRENT_STATE.md`

## CI: smoke logado opcional (P6)

Job relacionado: `.github/workflows/ci.yml` → `p6-route-ui-smoke`.

### Como ativar

1. Definir variável de repositório:
   - `P6_AUTH_SMOKE_ENABLED=true`
2. Definir secrets de CI:
   - `P6_AUTH_EMAIL`
   - `P6_AUTH_PASSWORD`
3. (Opcional) Definir fixture pública estrita:
   - variável `P6_PUBLIC_FIXTURE_USERNAME` (username que deve responder 200 em `/pt-BR/p/{username}`)

### Comportamento esperado

- Sem `P6_PUBLIC_FIXTURE_USERNAME`: rota pública segue validação permissiva (200/404) no route matrix.
- Com `P6_PUBLIC_FIXTURE_USERNAME` definido: rota pública do fixture vira validação estrita (200 obrigatório).
- Fallback seguro para ambiente novo (sem seed pública):
  - manter `P6_PUBLIC_FIXTURE_USERNAME` **não definido** até existir username público estável;
  - após seed confirmada, habilitar variável para ativar gate estrito.
- Com `P6_AUTH_SMOKE_ENABLED=false` (default): passo logado é ignorado com sucesso.
- Com `P6_AUTH_SMOKE_ENABLED=true` e secrets válidos:
  - roda `npm run qa:p6-auth-ui-smoke`
  - valida login + rotas `/dashboard`, `/dashboard/editor`, `/dashboard/settings`
  - publica artefatos em `p6-auth-smoke-artifacts`
- Com flag ativa e secrets ausentes/inválidos:
  - o passo falha (diagnóstico no `p6-auth-ui-smoke.log`)

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

## Exemplo rápido: nova seção com âncora explícita

```md
<a id="meu-topico-operacional"></a>

## Meu tópico operacional

Descrição curta do procedimento.
```

Depois de criar a seção:

- atualizar o atalho correspondente no `docs/README.md`;
- validar que o link abre corretamente no renderizador principal.

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
