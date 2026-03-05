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

## Índice operacional rápido

- [CI Status (quick check)](#ci-status-quick-check)
- [CI Troubleshooting (quick fix)](#ci-troubleshooting-quick-fix)
- [Post-deploy quick checklist](#post-deploy-quick-checklist)
- [Rollback rápido (produção)](#rollback-rápido-produção)
- [Incidente de autenticação (runbook curto)](#incidente-de-autenticação-runbook-curto)
- [Comandos operacionais frequentes](#comandos-operacionais-frequentes)
- [Nota de monitoramento (limitações atuais)](#nota-de-monitoramento-limitações-atuais)
- [Checklist pós-merge (PRs críticos)](#checklist-pós-merge-prs-críticos)
- [Template de incidente (session log)](docs/04_SESSION_LOG.md#incident-entry-template-quick)
- [Exemplo fictício de incidente](docs/04_SESSION_LOG.md#incident-example-fictitious)

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

## Post-deploy quick checklist

Use this after any push to `main`:

1. **GitHub Actions (CI)**
   - Open: https://github.com/Rmpjunior/pulse/actions/workflows/ci.yml
   - Confirm latest run is green (`lint`, `test`, `build`).
2. **Vercel deployment**
   - Confirm production deployment completed without build/runtime errors.
3. **Smoke check (manual)**
   - Open landing page.
   - Login/register flow loads correctly.
   - Dashboard/editor opens for authenticated user.
   - Public page (`/p/{username}`) renders and tracks clicks.
4. **If any step fails**
   - Check `CI Troubleshooting (quick fix)` section above.
   - Roll back only if production is impacted.

## Rollback rápido (produção)

Use quando um deploy novo quebra fluxo crítico (login, editor, página pública, erro 5xx recorrente).

### Critérios para rollback

- CI verde, mas produção com erro crítico para usuário final.
- Regressão confirmada após deploy recente em `main`.
- Impacto em jornada principal (acesso, edição, publicação, visualização pública).

### Passos (resposta rápida)

1. Identificar último commit estável conhecido em `main`.
2. Criar commit de reversão:
   - `git revert <commit_problematico>`
   - ou `git revert <sha_inicio>^..<sha_fim>` (quando forem vários)
3. Rodar validação local mínima:
   - `npm run lint`
   - `npm run test`
   - `npm run build`
4. Push para `main` e acompanhar CI.
5. Confirmar novo deploy em produção.

### Verificação pós-rollback

- Landing abre sem erro.
- Login/cadastro funcionam.
- Dashboard/editor carregam.
- Página pública (`/p/{username}`) renderiza corretamente.
- Não há erros críticos no deploy/runtime.

### Comunicação

- Registrar no `docs/04_SESSION_LOG.md`:
  - causa do rollback,
  - commit revertido,
  - horário,
  - status final de produção.

## Incidente de autenticação (runbook curto)

Use quando login/cadastro falhar para usuários (Google OAuth ou e-mail/senha).

### Diagnóstico rápido

1. **Escopo do incidente**
   - Falha só no Google?
   - Falha só em credenciais?
   - Falha geral de autenticação?
2. **Checagem de ambiente**
   - Garantir presença de envs críticas:
     - `AUTH_SECRET`
     - `AUTH_TRUST_HOST=true`
     - `NEXTAUTH_URL`
   - Para Google OAuth:
     - `AUTH_GOOGLE_ID`
     - `AUTH_GOOGLE_SECRET`
3. **Validação de callback Google**
   - URI esperada: `https://SEU_DOMINIO/api/auth/callback/google`
   - Conferir no Google Cloud Console se origin + redirect URI batem com produção.

### Ação imediata por cenário

- **Google quebrado, credenciais ok**
  - Manter fallback por e-mail/senha ativo.
  - Corrigir `AUTH_GOOGLE_ID/SECRET` ou callback URI.
- **Credenciais quebradas, Google ok**
  - Validar banco/conexão e fluxo de senha.
  - Checar integridade de `AUTH_SECRET` e sessões.
- **Tudo quebrado**
  - Verificar envs base (`AUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_TRUST_HOST`).
  - Se incidente persistir, executar rollback rápido (seção acima).

### Verificação pós-correção

- Login por e-mail/senha funciona.
- Login com Google funciona (se habilitado).
- Logout funciona.
- Redirecionamento pós-login vai para dashboard sem erro.

### Comunicação

- Registrar no `docs/04_SESSION_LOG.md`:
  - tipo de falha (Google, credenciais ou geral),
  - causa raiz,
  - ação aplicada,
  - horário de normalização.

## Comandos operacionais frequentes

```bash
# Gates locais de qualidade
npm run lint
npm run test
npm run build

# Fluxo rápido de rollback (exemplo)
git log --oneline -n 5
git revert <commit_problematico>
git push origin main

# Prisma / banco (quando necessário)
npx prisma generate
npx prisma db push
```

## Nota de monitoramento (limitações atuais)

No ambiente atual do agente, o monitoramento em tempo real de deploy tem limitações:

- Sem acesso CLI/API do GitHub Actions (`gh` ou token equivalente) para consultar runs automaticamente.
- Sem acesso CLI/API da Vercel (`vercel` ou token equivalente) para consultar status de deploy automaticamente.

### Acesso necessário para observabilidade completa

- **GitHub**: token com permissão de leitura de Actions (ou `gh` autenticado).
- **Vercel**: token com permissão de leitura de deployments (ou `vercel` autenticado).

### Enquanto o acesso não vem

- Usar links diretos no README para conferência manual de CI.
- Executar gates locais (`lint`, `test`, `build`) antes de cada push.
- Registrar bloqueio e próximo passo no update operacional.

## Checklist pós-merge (PRs críticos)

Use quando o merge envolve autenticação, billing, publicação, editor ou APIs centrais.

- [ ] CI da `main` verde (`lint`, `test`, `build`)
- [ ] Deploy de produção concluído sem erro de build/runtime
- [ ] Smoke mínimo executado:
  - [ ] login/cadastro
  - [ ] dashboard/editor
  - [ ] publicação e página pública
- [ ] Logs sem erro crítico novo após deploy
- [ ] Se houver regressão: aplicar rollback rápido + registrar incidente no `docs/04_SESSION_LOG.md`

## Validação rápida de links (README operacional)

Sempre que editar seções operacionais do README:

- [ ] Validar todos os links âncora do índice operacional
- [ ] Validar links para arquivos locais (ex.: `docs/04_SESSION_LOG.md`)
- [ ] Confirmar que os títulos das seções continuam idênticos às âncoras
- [ ] Verificar se não há link duplicado/obsoleto após renome de seção

## Handoff rápido (próximo turno)

Antes de encerrar um turno/sessão, confirmar:

- [ ] Último commit/push em `main` registrado no `docs/04_SESSION_LOG.md`
- [ ] `docs/02_CURRENT_STATE.md` atualizado com o status real
- [ ] `docs/03_BACKLOG.md` com próximo item claro (`TODO`/`IN_PROGRESS`/`DONE`)
- [ ] `npm run lint` e `npm run build` sem erro no lote entregue
- [ ] Bloqueios externos anotados com **input exato necessário**
- [ ] Se houve edição no README operacional, checklist de links revisado
- [ ] Próximo passo descrito em linguagem objetiva para continuidade imediata

## Existing Documentation

- `docs/FEATURES.md`: Product scope and inspiration notes
- `docs/ARCHITECTURE.md`: Initial architecture plan
- `docs/DATABASE.md`: Database model documentation
- `docs/API.md`: API reference
- `ENV_SETUP.md`: Environment setup details
- `PROGRESS.md`: Historical progress notes (legacy format)
