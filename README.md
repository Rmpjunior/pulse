# Pulse

[![CI](https://github.com/Rmpjunior/pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/Rmpjunior/pulse/actions/workflows/ci.yml)

Pulse is a bio-page builder inspired by keepo.bio.

This repository is structured to be continued by human contributors and AI coding agents (for example, OpenClaw + Codex).

## Start Here

1. Read `docs/README.md`
2. Read `docs/00_AGENT_START_HERE.md`
3. Check `docs/02_CURRENT_STATE.md`
4. Pick the next item in `docs/03_BACKLOG.md`
5. Log work in `docs/04_SESSION_LOG.md`

## Local Development

```bash
npm install
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## CI Status (quick check)

- Badge above reflects the latest result of `.github/workflows/ci.yml` on `main`.
- Direct link: https://github.com/Rmpjunior/pulse/actions/workflows/ci.yml
- Expected quality gates: `npm run lint` + `npm run test` + `npm run build`

## CI Troubleshooting (quick fix)

- `npm ci` failed:
  - Run locally: `rm -rf node_modules package-lock.json && npm install`
  - Commit the updated `package-lock.json`.
- `npm run test` failed (smoke/e2e):
  - Check `.env` / `.env.local` and database connectivity.
  - Run `npx prisma db push` before re-running tests.
- `npm run build` failed:
  - Run `npm run lint` and `npm run test` first to isolate root cause.
  - Check recently changed routes/components for typing/runtime regressions.
- Prisma client mismatch:
  - Run `npx prisma generate` and commit lockfile/schema changes when applicable.

## Existing Documentation

- `docs/FEATURES.md`: Product scope and inspiration notes
- `docs/ARCHITECTURE.md`: Initial architecture plan
- `docs/DATABASE.md`: Database model documentation
- `docs/API.md`: API reference
- `ENV_SETUP.md`: Environment setup details
- `PROGRESS.md`: Historical progress notes (legacy format)
