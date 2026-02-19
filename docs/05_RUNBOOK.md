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
