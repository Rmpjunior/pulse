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
- Onboarding wizard inicial ativo (2 passos): título + username, categoria e primeira seção com criação guiada da página
- Biblioteca de seções no editor ativa com atalhos `Welcome`, `About`, `Catalog`, `Links`, `Social` (com templates iniciais)
- Gestão de seções com controles mobile explícitos (subir/descer/mostrar-remover) para add/edit/remove/reorder com melhor clareza em telas pequenas
- Publish flow com checagem de disponibilidade de slug antes de publicar + estado explícito de sucesso após publicação
- Ações pós-publicação disponíveis e polidas: `copy link` com fallback de clipboard e `view website` direto do estado de sucesso
- Recovery de rascunho ativo no editor (detecção local de draft + decisão explícita `Recuperar` ou `Descartar`)
- Perfil essencial implementado de ponta a ponta: avatar (URL), display name e bio no editor + preview + página pública
- Mobile-first polish aplicado no editor (ações sticky, densidade/layout mobile, grade adaptada no picker e barra de ações otimizada para 390x844)
- Seção `Welcome` com campos dedicados (foto, display name, featured title, second title, CTA) ativa no editor/preview/público via variante estruturada
- Seção `About` com campos dedicados (page title, featured title opcional, descrição completa, imagem) ativa no editor/preview/público via variante estruturada
- `Links` com validação obrigatória de título+URL e suporte a thumbnail por `emoji` ou `image` no editor/preview/público
- `Social media` com inputs dedicados por plataforma (Facebook, Instagram, X, YouTube, LinkedIn, WhatsApp, Behance, Dribbble, Medium, Twitch, TikTok, Vimeo)
- Matriz de gating Free vs Plus definida em código (`src/lib/subscription/gating.ts`) e aplicada em fluxos-chave (editor plan capabilities + watermark no público)
- Skeleton de billing Stripe ativo: endpoint de checkout (`/api/billing/checkout`) + webhook (`/api/billing/webhook`) + cliente server utilitário com validação de env
- Plan-gated limits ativos no fluxo principal: limite de seções no editor por plano (`maxSections`), custom colors/premium themes sob `isPlusUser`, watermark controlado por capability de plano no público
- Gatilhos contextuais de upgrade ativos na jornada do editor (ao bater limite de seções e ao acessar aba de tema sem Plus), com CTA direto para assinatura
- Analytics UX alinhada ao plano: filtro por período com lock contextual quando excede limite de histórico (`analyticsDays`) e prompt de upgrade orientado
- Self-service de conta fortalecido: forgot-password agora usa endpoint real (`/api/auth/forgot-password`) com token de reset e settings com exclusão de conta confirmada (`DELETE_MY_ACCOUNT` + senha quando aplicável)
- Estratégia de auth Google validada ponta a ponta: provider só ativa com env obrigatória, login/cadastro usam a mesma regra do servidor (evita drift client-side) e fallback por credenciais permanece estável
- Checklist de produção para Google OAuth publicado em `docs/09_GOOGLE_AUTH_PRODUCTION_CHECKLIST.md` com envs obrigatórias/recomendadas e passo a passo de validação manual
- Dashboard com paridade multi-site (`Your Keepos`): lista de sites com ações rápidas `Editar`, `Abrir` e `Config`, além de editor suportando seleção por `pageId`
- UX de validação de social/media enriquecida: editor sinaliza URL inválida em redes sociais e exige formato válido para embeds de mídia antes de salvar
- Página pública com hardening inicial de performance/acessibilidade: `main` semântico, `iframe` com `title`+`loading=lazy`, imagens com `loading/decoding/referrerPolicy` e links sociais com `aria-label`
- Onboarding com templates reutilizáveis (Creator/Business/Personal packs) para acelerar ativação com blocos iniciais prontos
- PT-BR hardening aplicado em superfícies críticas de onboarding/dashboard (labels de templates/categorias e gestão multi-site), reduzindo textos residuais em inglês para o usuário final
- Plano técnico de custom domain/subdomain publicado em `docs/08_CUSTOM_DOMAIN_PLAN.md` com arquitetura, modelo de dados, APIs, critérios e rollout quebrado em etapas
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
