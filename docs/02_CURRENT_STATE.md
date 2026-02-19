# Current State

Last updated: 2026-02-18

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

## Partially Implemented / Gaps

- Some block types exist in types but not fully implemented in UI rendering/editing (`CATALOG`, `FORM`)
- Analytics visitor identity is naive/random (not durable across sessions)
- No test suite baseline yet
- i18n infrastructure exists but runtime is intentionally PT-BR only
- Stripe/payment flow is not integrated (subscription model exists)
- PWA/Capacitor strategy docs exist, implementation incomplete

## Documentation Health

- `docs/*` reference docs are useful but include future/planned content.
- Use this file + `docs/03_BACKLOG.md` as the operational source of truth.
