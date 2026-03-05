# Backlog

Status legend: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`

## P0 (Reliability + Parity Foundation)

| ID | Status | Task | Why |
|---|---|---|---|
| P0-1 | DONE | Add request validation (zod) to page/block/auth APIs | Prevent malformed data and runtime errors |
| P0-1.1 | DONE | Restore green build/lint gates after validation rollout | Prevent failed Vercel deploys |
| P0-2 | DONE | Add centralized API error shape and error helper | Make client handling consistent |
| P0-3 | DONE | Add minimal test baseline for critical flows | Reduce regressions |
| P0-4 | DONE | Ensure ownership checks are consistent in all mutating APIs | Security/data isolation |
| P0-5 | DONE | Define official feature parity matrix (Keepo → Pulse) in code/docs and acceptance criteria | Remove ambiguity and guide execution order |
| P0-6 | DONE | Establish E2E smoke suite for core creator journey (create → edit → publish → view) | Protect core business flow |

## P1 (Core Keepo Parity - MVP Completo)

| ID | Status | Task | Why |
|---|---|---|---|
| P1-1 | DONE | Complete `CATALOG` block edit/render path | Close feature gap |
| P1-2 | DONE | Complete `FORM` block edit/render path | Close feature gap |
| P1-3 | DONE | Improve analytics visitor identification strategy | Better data quality |
| P1-4 | DONE | Add optimistic UI + toasts in editor | Better UX feedback |
| P1-5 | DONE | Implement onboarding wizard (title + category + first section) | Match Keepo's fast first-run flow |
| P1-6 | DONE | Implement section library in editor (`Welcome`, `About`, `Catalog`, `Links`, `Social`) | Reach section-level parity |
| P1-7 | DONE | Add section management UX (add/edit/remove/reorder with clear mobile controls) | Editor usability and parity |
| P1-8 | DONE | Implement publish flow with slug availability check and explicit success state | Match Keepo publish behavior |
| P1-9 | DONE | Implement post-publish actions (`copy link`, `view website`) | Close publish-to-distribution loop |
| P1-10 | DONE | Add draft/in-progress recovery flow (recover/discard) | Prevent creator work loss |
| P1-11 | DONE | Implement profile header essentials (avatar, display name, bio) in editor + public page | Keepo baseline profile UX |
| P1-12 | DONE | Deliver mobile-first editor polish pass (390x844 as reference) | Keep parity with mobile editing expectation |
| P1-13 | DONE | Implement `Welcome` section fields parity: profile photo upload, display name, featured title, second title, CTA text/link | Exact first-fold parity |
| P1-14 | DONE | Implement `About` section fields parity: page title, optional featured title, full description, image | Content storytelling parity |
| P1-15 | DONE | Implement `Links` item editor parity: title (required), URL (required), thumbnail type (`image`/`emoji`) | Better link conversion UX |
| P1-16 | DONE | Implement `Social media` section parity with platform-specific inputs | Match Keepo social block utility |

## P2 (Account, Growth, Monetization Parity)

| ID | Status | Task | Why |
|---|---|---|---|
| P2-1 | DONE | Define subscription gating matrix in code (Free vs Plus) | Prepare premium flows |
| P2-2 | DONE | Implement Stripe checkout + webhook skeleton | Monetization foundation |
| P2-3 | DONE | Add custom domain/subdomain implementation plan to code backlog | Align with business plan |
| P2-4 | DONE | Implement plan-gated limits (sections limit, custom colors, watermark removal) | Match Keepo free/plus behavior |
| P2-5 | DONE | Add upgrade triggers inside editor journey (contextual paywall prompts) | Increase conversion |
| P2-6 | DONE | Build analytics UX baseline (views/clicks by period) and tie to gated plan strategy | Product value and upsell |
| P2-7 | DONE | Add account self-service flows (password reset, account deletion) | Expected SaaS baseline |
| P2-8 | DONE | Expand auth strategy decision: Google OAuth reliability and fallback path | Reduce auth friction |
| P2-9 | DONE | Add multi-site dashboard management parity (`Your Keepos`, edit/open/settings actions) | Operational parity for creators with >1 site |
| P2-10 | DONE | PT-BR hardening pass (UI, toasts, validações, mensagens de erro, e-mails e placeholders) + regra de bloqueio para novos textos em inglês | Garantir experiência 100% em português brasileiro |

## P3 (Polish / Advanced Differentiators)

| ID | Status | Task | Why |
|---|---|---|---|
| P3-1 | DONE | Add richer social/media embed coverage and validation UX | Better creator flexibility |
| P3-2 | DONE | Add public page performance + accessibility hardening pass | Quality and trust |
| P3-3 | DONE | Add reusable templates / quick-start presets for first-time creators | Faster activation |

## P4 (Post-Roadmap Hardening / UX Quality)

| ID | Status | Task | Why |
|---|---|---|---|
| P4-1 | DONE | Reinserir/validar autenticação com Google ponta a ponta (login/cadastro/fallback) e listar envs faltantes para produção | Garantir OAuth funcional e sem regressões |
| P4-2 | DONE | Adicionar e aplicar skills `vercel-react-best-practices`, `web-design-guidelines` e `frontend-design` (referência: `skills.sh`) no ciclo de frontend | Reduzir aparência de app “gerado por IA” e elevar padrão visual/técnico |
| P4-3 | DONE | Revisão de imagens/ícones da landing e do app completo; mapear pontos fracos visuais e gerar prompts prontos para criação em IA externa | Melhorar percepção de qualidade visual com plano executável |
| P4-4 | DONE | Troca guiada de imagens/ícones após recebimento dos assets gerados + validação visual responsiva | Fechar loop de melhoria visual com implementação real |

## P5 (Continuous Hardening)

| ID | Status | Task | Why |
|---|---|---|---|
| P5-1 | DONE | Reduzir warnings de lint prioritários (imports/estados não usados + migração incremental de `<img>` para `next/image`) | Manter qualidade contínua pós-roadmap e facilitar evolução sem ruído |
| P5-2 | DONE | Migrar `<img>` críticos da página pública (`/p/[username]`) para `next/image` em lotes pequenos | Melhorar performance percebida e reduzir warnings de lint remanescentes |
| P5-3 | DONE | Migrar `<img>` remanescentes em editor/preview/components compartilhados para `next/image` | Finalizar limpeza de warnings de imagem com menor risco incremental |
| P5-4 | DONE | Migrar `<img>` finais em `editor-content`, `block-editor` e `themed-preview` para zerar warnings de imagem | Fechar hardening visual/performance com lint praticamente limpo |
| P5-5 | DONE | Resolver aviso recorrente de workspace root do Next.js (`turbopack.root`/lockfiles) | Reduzir ruído de build e risco de configuração ambígua em CI/deploy |
| P5-6 | DONE | Adicionar pipeline de CI (lint + testes + build) no GitHub Actions | Proteger `main` contra regressões e padronizar validação automática |
| P5-7 | DONE | Corrigir criação de múltiplas páginas por conta removendo trava legada de página única na API `/api/pages` | Garantir paridade real de multi-site no dashboard |
| P5-8 | DONE | Otimizar workflow de CI com `concurrency` e permissões mínimas | Reduzir gasto de runner e evitar execuções duplicadas em pushs rápidos |
| P5-9 | DONE | Publicar selo de CI + instrução rápida no README para status de qualidade | Facilitar visibilidade instantânea da saúde da `main` |
| P5-10 | DONE | Adicionar seção de diagnóstico rápido da CI no README (falhas comuns + ação imediata) | Reduzir tempo de diagnóstico quando pipeline falhar |
| P5-11 | DONE | Criar checklist pós-deploy (GitHub Actions + Vercel + smoke mínimo) para uso rápido em operação | Padronizar validação final após push em `main` |
| P5-12 | DONE | Registrar guia de rollback rápido (critério + passos + verificação) | Diminuir tempo de resposta em incidentes de produção |
| P5-13 | DONE | Criar guia curto para incidentes de autenticação (Google OAuth + credenciais) | Acelerar diagnóstico quando login falhar em produção |
| P5-14 | DONE | Consolidar índice operacional no README (links rápidos para CI, deploy, rollback e guia de autenticação) | Diminuir tempo de navegação durante operação/incidente |
| P5-15 | DONE | Adicionar mini-checklist de passagem de turno no README operacional | Garantir continuidade rápida entre sessões/agentes |
| P5-16 | DONE | Limpar duplicidade de IDs no backlog (`P5-7`) e normalizar numeração contínua | Evitar ambiguidade de rastreio em sessões futuras |
| P5-17 | DONE | Revisar consistência de nomenclatura dos itens P5 (termos PT-BR/EN) e padronizar estilo | Melhorar legibilidade e busca no backlog |
| P5-18 | DONE | Criar seção curta "comandos operacionais frequentes" no README (CI/build/rollback) | Reduzir tempo de execução em resposta a incidentes |
| P5-19 | DONE | Adicionar nota de monitoramento (limitações atuais + acesso necessário) no README operacional | Tornar explícito o que falta para observabilidade completa de deploy |
| P5-20 | DONE | Adicionar checklist curto de verificação pós-merge para PRs críticos | Reduzir risco de regressão silenciosa após mudanças sensíveis |
| P5-21 | DONE | Adicionar template curto de registro de incidente no `docs/04_SESSION_LOG.md` | Padronizar documentação de falhas e reduzir omissões no pós-mortem |
| P5-22 | DONE | Adicionar exemplo preenchido de incidente no session log (fictício) para facilitar uso | Reduzir atrito na adoção do template durante incidentes reais |
| P5-23 | DONE | Incluir atalho para template de incidente no índice operacional do README | Facilitar acesso rápido em momentos de pressão operacional |
| P5-24 | DONE | Adicionar atalho para exemplo fictício de incidente no README | Facilitar onboarding de novos agentes no fluxo de incidentes |
| P5-25 | DONE | Adicionar checklist mínimo para validar links do README operacional após edits | Evitar links quebrados na documentação de operação |
| P5-26 | TODO | Incluir mini-regra de revisão de links no handoff rápido | Garantir que validação de links não seja esquecida entre turnos |
















## Discovery Notes (Keepo live exploration)

Validated in real Keepo flow (`editor.keepo.bio`) using authenticated session:
- Create minisite (FREE path)
- Define title/category
- Add/edit sections
- Navigate sections → preview → publish
- Publish with slug and open public URL
- Manage existing sites in dashboard (`Your Keepos` + `Edit` + `Open Keepo` + settings)

### Field-level findings captured
- `Welcome`: profile photo upload, display name, featured title, second title, CTA title/link
- `About`: page title, featured text (optional), full description, image
- `Links`: page title + list of items; item has required title + required URL + thumbnail mode (image/emoji)
- `Social media`: dedicated fields for Facebook, Instagram, Twitter, YouTube, LinkedIn, WhatsApp, Behance, Dribbble, Medium, Twitch, TikTok, Vimeo
- `Publish`: slug choice + publish success state with actions (`copy link`, `view website`)

Evidence files (workspace root):
- `keepo-create-step2.png`
- `keepo-links-editor-open.png`
- `keepo-links-editor-filled.png`
- `keepo-publish-result.png`
- `keepo-public-pulseqa330586.png`
- `keepo-feature-deep3.json`
- `keepo-links-catalog-deep.json`

## Task Update Rules

- Move one task to `IN_PROGRESS` per session.
- Mark `DONE` only after code + validation + docs update.
- If blocked, add blocker reason and dependency in `docs/04_SESSION_LOG.md`.
