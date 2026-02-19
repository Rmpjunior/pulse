# OpenClaw Setup Requirements

This document defines what must be in place so OpenClaw + Codex can run coding sessions smoothly on this private repository.

## 1) Machine Requirements

- Node.js 20+
- npm available
- Git installed
- Access to this repo local working copy
- Ability to run long-lived processes (`npm run dev`)

## 2) Repository Access (Private GitHub)

OpenClaw runtime identity must have:

- Read + write access to the private Pulse repo
- Permission to create branches
- Permission to push commits
- Permission to open/update pull requests

Preferred setup:

- Create a dedicated GitHub service account or GitHub App for OpenClaw.
- Grant access only to this repository (or a restricted org team).
- Use least privilege; avoid full org admin scopes.

## 3) Required Secrets / Environment

The execution environment used by OpenClaw must provide:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AUTH_GOOGLE_ID` (if Google login is used)
- `AUTH_GOOGLE_SECRET` (if Google login is used)

Optional but useful:

- Vercel env access for preview parity
- Blob/Stripe keys when those features are actively developed

## 4) Vercel Permissions

Since deploys are already automatic via Git integration, Vercel CLI is optional.

Minimum needed:

- GitHub integration connected (already done)
- OpenClaw can push branches to trigger preview deploys

Optional (if using Vercel CLI in agent sessions):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 5) WhatsApp-to-OpenClaw Operational Requirements

- A trusted command channel that maps your father messages to session prompts.
- Clear session metadata attached to each run:
  - request text
  - requested priority
  - branch target
  - who approved deployment
- Human approval step before merging to `main`.

## 6) Required Session Behavior (Enforced Process)

Each OpenClaw/Codex session must:

1. Read `docs/00_AGENT_START_HERE.md`
2. Choose task from `docs/03_BACKLOG.md`
3. Implement and validate locally
4. Update:
   - `docs/02_CURRENT_STATE.md` when behavior changes
   - `docs/03_BACKLOG.md` status
   - `docs/04_SESSION_LOG.md` new entry
5. Push branch and open PR (or provide patch) for review

## 7) Manual Approval Gates (Recommended)

- Gate A: Approve dependency installs/new external integrations
- Gate B: Approve schema/database migrations
- Gate C: Approve merge to `main`

## 8) Security Checklist

- Never expose secrets in docs/commits/logs
- Rotate credentials if a session leaks sensitive data
- Restrict OpenClaw identity to required repos/projects only
- Enable branch protection on `main`:
  - PR required
  - status checks required
  - no force push

## 9) First-Time Setup Checklist

- [ ] Create OpenClaw GitHub identity (service user or app)
- [ ] Grant private repo write access
- [ ] Configure environment variables for runtime
- [ ] Confirm local `npm run lint` and `npm run build` work
- [ ] Confirm push from OpenClaw identity triggers Vercel preview
- [ ] Confirm preview URL can be reviewed before merge
