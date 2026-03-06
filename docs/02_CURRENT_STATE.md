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
- Ciclo de qualidade frontend formalizado com `skills.sh` + `docs/10_FRONTEND_QUALITY_PLAYBOOK.md` (referências: vercel-react-best-practices, web-design-guidelines, frontend-design)
- Landing page recebeu melhoria de hierarquia visual (faixa de confiança no hero + seção "Como funciona" em 3 passos) para reduzir aparência genérica e aumentar clareza de proposta de valor
- Auditoria visual completa de imagens/ícones documentada em `docs/11_VISUAL_ASSET_AUDIT_PROMPTS.md`, com mapeamento de fragilidades e prompt pack pronto para geração externa
- Troca guiada de assets iniciada e aplicada em superfícies-chave: landing hero agora usa imagem real (`public/Gemini_Generated_Image_mhylomhylomhylom.png`) e branding principal migrou para `BrandLogo` com `public/icon.png` (landing + auth + sidebar), com validação responsiva base
- Hardening contínuo pós-roadmap iniciado: limpeza de warnings prioritários (import/estado não usados) e migração incremental de imagem no settings para `next/image`
- Página pública (`/p/[username]`) migrou imagens críticas para `next/image` (avatar, thumbnails de link, imagens de About/Destaque e foto da seção Welcome), reduzindo warnings de lint de 15 para 10
- Componentes compartilhados também avançaram na migração (`dashboard/header` e `blocks/block-renderer`), reduzindo warnings de imagem para 6 no total
- Migração final de `<img>` concluída em `editor-content`, `block-editor` e `themed-preview`; `npm run lint` agora sem warnings/erros
- Configuração do Next.js ajustada com `turbopack.root` (`process.cwd()`), removendo aviso recorrente de root ambíguo no build
- Pipeline de CI adicionada em `.github/workflows/ci.yml` com gates automáticos de `lint`, `test` e `build` para `push` na `main` e `pull_request`
- Workflow de CI otimizada com `concurrency` (`cancel-in-progress`) e permissões mínimas (`contents: read`) para reduzir execuções redundantes e endurecer segurança padrão
- README agora exibe badge de CI com link direto para a workflow e checklist rápido dos gates de qualidade
- README inclui seção de troubleshooting rápido da CI (falhas comuns de `npm ci`, testes, build e Prisma + ações imediatas)
- README inclui checklist pós-deploy (CI + Vercel + smoke manual) para validação operacional rápida após merge em `main`
- README inclui playbook de rollback rápido em produção (critério, passos, verificação e protocolo de comunicação)
- README inclui runbook curto de incidente de autenticação (Google OAuth + credenciais) com diagnóstico, ações por cenário e verificação pós-correção
- README agora tem índice operacional rápido com links diretos para CI, troubleshooting, checklist pós-deploy, rollback e incidente de autenticação
- README inclui mini-checklist de handoff para continuidade entre turnos/sessões sem perda de contexto operacional
- Backlog P5 teve numeração normalizada (remoção de ID duplicado `P5-7`), melhorando rastreabilidade histórica das entregas
- Backlog P5 teve nomenclatura padronizada para PT-BR (ex.: selo, diagnóstico, guia, passagem de turno), reduzindo mistura de termos EN/PT
- README inclui seção "Comandos operacionais frequentes" (gates locais, rollback e Prisma) para acelerar resposta em incidentes
- README inclui nota explícita de monitoramento (limitações atuais + acessos GitHub/Vercel necessários) para transparência operacional
- README inclui checklist pós-merge para PRs críticos (CI, deploy, smoke e ação imediata em regressão)
- `docs/04_SESSION_LOG.md` agora inclui template curto de incidente (severity, trigger, mitigação, causa raiz e follow-up), padronizando pós-mortem rápido
- `docs/04_SESSION_LOG.md` inclui exemplo fictício preenchido de incidente para acelerar adoção do template em situações reais
- Índice operacional do README agora inclui atalho direto para o template de incidente no `docs/04_SESSION_LOG.md`
- Índice operacional também inclui atalho direto para o exemplo fictício de incidente, facilitando onboarding e uso guiado do formato
- README inclui checklist mínimo de validação de links operacionais após edits, reduzindo risco de âncoras quebradas
- Handoff rápido agora inclui mini-regra explícita para revisar links quando houver edição do README operacional
- Handoff rápido inclui validação de idioma PT-BR para qualquer texto novo de UI/documentação, reforçando guardrail anti-regressão em inglês
- Referência cruzada da regra PT-BR foi explicitada entre `README.md` (handoff), `docs/03_BACKLOG.md` (`P2-10`) e `docs/README.md` (hub operacional)
- Template padrão de sessão (`docs/04_SESSION_LOG.md`) agora exige quality check documental (revisão de links + confirmação PT-BR)
- Template inclui lembrete explícito de preenchimento obrigatório do `Quality Check (docs)` em novas sessões
- Entradas recentes do session log (lotes de 2026-03-05) foram retroajustadas com `Quality Check (docs)` preenchido para manter consistência histórica imediata
- `docs/05_RUNBOOK.md` agora define quando usar `Quality Check (docs)` como gate de saída obrigatório em sessões com alterações
- `docs/00_AGENT_START_HERE.md` agora inclui micro-checklist de gate documental no fluxo obrigatório de sessão
- `docs/06_OPENCLAW_SETUP.md` agora referencia explicitamente o gate documental (`Quality Check (docs)` + revisão de links + confirmação PT-BR) como parte do comportamento obrigatório de sessão
- `docs/README.md` (hub operacional) agora destaca explicitamente o gate documental obrigatório na entrada da seção de docs primárias
- Hub de docs agora aponta direto para `docs/04_SESSION_LOG.md#quality-check-docs`, reduzindo tempo para consultar o formato obrigatório
- Descrição do item `docs/04_SESSION_LOG.md` no hub foi padronizada em PT-BR para consistência de linguagem nos metadados de documentação
- `docs/README.md` teve as descrições operacionais revisadas para PT-BR de ponta a ponta, removendo resíduos de inglês no bloco principal de execução
- Política de idioma do hub foi definida: docs operacionais em PT-BR; docs de referência técnica podem permanecer em EN (quando estrutural/técnico)
- `docs/01_PRODUCT_BRIEF.md` agora traz resumo curto da política de idioma, alinhando direção de produto e execução operacional
- `docs/05_RUNBOOK.md` agora inclui checklist curto de auditoria de idioma para novos docs (PT-BR/EN), reduzindo risco de drift linguístico
- Hub de docs (`docs/README.md`) agora traz atalho direto para a checklist de auditoria de idioma no runbook, incentivando uso recorrente
- Âncoras críticas do hub foram estabilizadas com IDs ASCII explícitos (`quality-check-docs` e `language-audit-checklist`) para compatibilidade entre renderizadores markdown
- Atalho do template de sessão no hub também foi migrado para ID explícito (`session-template`), consolidando padrão de links internos críticos
- Convenção oficial de âncoras internas (IDs ASCII explícitos) documentada no hub (`docs/README.md`) e reforçada no runbook para prevenir regressões de compatibilidade
- `docs/05_RUNBOOK.md` agora inclui exemplo prático de criação de seção com âncora explícita, com passo de atualização do atalho no hub
- Checklist de handoff no `README.md` agora cobra mini-check de âncora explícita ASCII quando houver nova seção linkável
- Seção `Existing Documentation` do README raiz foi alinhada à política PT-BR/EN do hub, removendo conflito de linguagem entre documentos de entrada
- Índice operacional do README raiz avançou para IDs explícitos também nas seções com acento (rollback, incidente, monitoramento, pós-merge), reduzindo ambiguidade de âncoras
- Migração para IDs explícitos foi estendida às seções operacionais restantes do README raiz (CI, troubleshooting, post-deploy, comandos, validação de links e handoff)
- README raiz agora inclui nota de manutenção exigindo ID ASCII explícito para novas seções operacionais, prevenindo regressão de padrão
- Micro-check automático adicionado (`npm run check:readme-anchors`) para validar âncoras do índice operacional no README raiz
- Micro-check expandido para validar também links de arquivo com âncora (ex.: `docs/04_SESSION_LOG.md#...`) com exigência de IDs explícitos no destino
- P6 QA iniciado com `qa:p6-route-matrix` (smoke de rotas deslogadas) + checagem manual de UI em login/register/forgot-password via browser snapshot
- CI agora executa `npm run check:readme-anchors` dentro do job principal, transformando a convenção de âncoras em gate contínuo de merge
- README operacional agora recomenda `npm run check:readme-anchors` como pré-push local para antecipar falhas documentais antes da CI
- P6 avançou com baseline técnico: `qa:p6-route-matrix` agora valida rotas deslogadas e protegidas em perfis mobile/tablet/desktop (com checagem de redirect para login)
- Route-level UI checks deslogado foram executados em browser real (landing/login/register/forgot + redirect dashboard→login), confirmando fluxo visual básico sem regressão crítica
- Baseline visual deslogado começou a ser materializado com screenshots mobile/desktop em artefatos locais (`/home/claw/.openclaw/media/browser/...`) para comparação manual entre ciclos de QA pesado
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
