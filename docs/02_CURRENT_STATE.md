# Current State

Last updated: 2026-03-04

## Runtime Stack

- Next.js 16 + React 19 + TypeScript
- Prisma + PostgreSQL
- NextAuth v5 beta
- next-intl (currently PT-BR only in runtime)

## Implemented

- Landing page with pricing/features sections
- Register/login/forgot-password pages
- Auth API (`/api/auth/*`, `/api/auth/register`)
- Dashboard shell and overview
- Page CRUD API (`/api/pages`, `/api/pages/[pageId]`)
- Block CRUD/reorder API (`/api/pages/[pageId]/blocks*`)
- Editor:
  - create page
  - add/edit/delete/reorder blocks
  - visibility toggle
  - theme editor + preview
- Public page route (`/p/[username]`) with publish check
- Analytics APIs:
  - page analytics aggregate
  - click tracking
- Input validation:
  - shared `zod` request validation for auth/user/pages/blocks/analytics APIs
- Build reliability hardening:
  - fixed TypeScript/Prisma JSON typing in page/block update and block create APIs
  - lint now runs without errors (warnings remain)
  - production build passes locally (`next build`)
- API reliability hardening:
  - centralized API error helper (`src/lib/api/errors.ts`) with consistent error format
  - auth/user/pages/blocks/analytics/register routes now return standardized API errors
  - ownership checks reforçados nos endpoints mutáveis de blocos (escopo por `pageId` + `userId`, incluindo reorder seguro)

## Partially Implemented / Gaps

- `CATALOG` possui caminho completo de edição/render (adicionar item, editar campos e render público com CTA opcional)
- `FORM` possui caminho completo de edição/render (configurar campos/título/botão no editor e render de formulário no público)
- Editor com feedback imediato: toasts para sucesso/erro e updates otimistas com rollback em add/edit/delete/reorder/visibility de blocos
- Visitor identity para analytics agora usa fingerprint estável por request headers (user-agent + idioma + IP encaminhado hash), substituindo ID aleatório por evento
- Test baseline ativo com Vitest (`npm run test`) cobrindo helpers críticos de API (error shape + validation)
- Smoke E2E mínimo ativo (`npm run test:smoke`) validando jornada core persistida (create → edit → publish → view) em fluxo integrado com banco
- Matriz oficial de paridade Keepo → Pulse publicada em `docs/07_FEATURE_PARITY_MATRIX.md` com critérios de aceite por feature
- i18n infrastructure exists but runtime is intentionally PT-BR only
- Stripe/payment flow is not integrated (subscription model exists)
- PWA/Capacitor strategy docs exist, implementation incomplete

## Documentation Health

- `docs/*` reference docs are useful but include future/planned content.
- Use this file + `docs/03_BACKLOG.md` as the operational source of truth.
