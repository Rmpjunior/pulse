# Custom Domain / Subdomain Implementation Plan

Status: Drafted (P2-3)
Last updated: 2026-03-04

## Objective
Implementar suporte de domínio personalizado e subdomínio dedicado no Pulse com segurança, verificação e fallback operacional.

## Scope
- Subdomain Pulse-managed: `username.pulse.to` (ou domínio equivalente)
- Custom domain user-managed: `www.exemplo.com` / `links.exemplo.com`
- SSL automático
- Roteamento para página pública do criador

## Architecture (high-level)
1. Usuário cadastra domínio no dashboard.
2. Pulse gera instruções DNS (CNAME/A conforme provider).
3. Job/endpoint de verificação confirma apontamento.
4. Domínio validado é vinculado ao `pageId`.
5. Middleware resolve `host` → página pública.
6. Fallback para `pulse.app/p/:username` se domínio inválido/desconectado.

## Data Model Additions (proposal)
Tabela `DomainBinding`:
- `id`
- `userId`
- `pageId`
- `host` (unique)
- `type` (`SUBDOMAIN` | `CUSTOM`)
- `status` (`PENDING_VERIFICATION` | `ACTIVE` | `FAILED` | `DISCONNECTED`)
- `verificationToken`
- `lastCheckedAt`
- `createdAt` / `updatedAt`

## API Surface (proposal)
- `POST /api/domains` → criar binding + instruções DNS
- `POST /api/domains/:id/verify` → rodar verificação manual
- `GET /api/domains` → listar domínios do usuário
- `DELETE /api/domains/:id` → remover binding

## Verification Strategy
- DNS lookup (CNAME/A/TXT opcional)
- Regra mínima:
  - custom domain: CNAME para target oficial Pulse (ou A para edge IP definido)
  - subdomain: reservado internamente e validado por unicidade
- Timeout + retries exponenciais
- Estado de erro legível para usuário

## TLS / Certificate Strategy
- Delegar emissão/renovação para plataforma de hosting (Vercel/edge provider)
- Só marcar `ACTIVE` após provider confirmar domínio válido/SSL pronto

## Middleware Resolution
- Ler `host` do request
- Ignorar hosts internos (`localhost`, preview, app default)
- Resolver binding ativo
- Injetar contexto de página pública por host
- Se não resolver: seguir fluxo padrão por path

## Security / Abuse Controls
- Limitar quantidade de domínios por plano
- Ownership checks estritos (`userId`)
- Bloquear takeover de host já registrado
- Sanitização de host + punycode

## Rollout Plan (task breakdown)
1. Schema + migration `DomainBinding`
2. CRUD API + validação
3. Verifier service
4. Dashboard UI (add/list/remove/retry verify)
5. Middleware host resolution
6. Smoke tests (host mapping + fallback)
7. Observability/logging + runbook

## Acceptance Criteria
- Usuário consegue conectar domínio custom com status claro
- Host ativo resolve para página correta
- SSL ativo em produção
- Fallback para URL padrão funciona
- Remoção de domínio revoga resolução imediatamente

## Open Decisions
- Domínio padrão final do Pulse para subdomínios
- Provider definitivo para verificação DNS (Node DNS direto vs API externa)
- Limites por plano (FREE vs PLUS)
