# Keepo → Pulse Feature Parity Matrix (Official)

Last updated: 2026-03-04
Owner: Product/Engineering (Pulse)

## Purpose

Esta matriz define a paridade oficial entre o comportamento observado no Keepo e o alvo no Pulse.
Ela vira a referência única de aceite para execução do backlog (principalmente P1/P2).

## Status Legend

- `DONE`: comportamento implementado e validado no Pulse
- `PARTIAL`: existe no Pulse, mas incompleto vs Keepo
- `TODO`: ainda não implementado

## Core Creator Journey (P0/P1)

| Area | Keepo Baseline | Pulse Target (Acceptance Criteria) | Status | Backlog |
|---|---|---|---|---|
| Onboarding wizard | Fluxo inicial rápido com título + categoria + criação | Novo usuário consegue criar primeiro minisite em até 3 passos (title/category/first section), com transição direta ao editor | TODO | P1-5 |
| Section library | Biblioteca com opções `Welcome`, `About`, `Catalog`, `Links`, `Social media` | Modal/biblioteca mostra as 5 seções e permite adicionar cada uma com estado visível no canvas | TODO | P1-6 |
| Section management | Adicionar/editar/remover/reordenar seções com UX mobile | Editor permite add/edit/remove/reorder sem perder dados; controles funcionam em viewport 390x844 | TODO | P1-7, P1-12 |
| Publish flow | Definição de slug + sucesso explícito | Antes de publicar, slug é validado (disponível/indisponível); após publicar, mostra estado de sucesso claro | TODO | P1-8 |
| Post-publish actions | `copy link` + `view website` após publish | Tela de sucesso oferece copiar URL e abrir página pública em 1 toque cada | TODO | P1-9 |
| Draft recovery | Keepo recupera rascunho/em progresso | Ao retornar a rascunho pendente, usuário escolhe recuperar ou descartar | TODO | P1-10 |

## Section-Level Parity (Field-by-field)

| Section | Keepo Baseline | Pulse Target (Acceptance Criteria) | Status | Backlog |
|---|---|---|---|---|
| Welcome | foto, display name, featured title, second title, CTA text/link | Form do bloco expõe todos os campos; preview público renderiza os campos; CTA abre link informado | TODO | P1-13 |
| About | page title, featured title opcional, descrição completa, imagem | Editor salva e renderiza todos os campos; imagem persistida e exibida no público | TODO | P1-14 |
| Links | item com title obrigatório, URL obrigatória, thumbnail image/emoji | Validação bloqueia salvar item sem title/URL; usuário escolhe thumbnail `image` ou `emoji`; público mostra item corretamente | TODO | P1-15 |
| Social media | campos dedicados por plataforma (FB, IG, X, YouTube, LinkedIn, WhatsApp, Behance, Dribbble, Medium, Twitch, TikTok, Vimeo) | Editor oferece campos dedicados por plataforma; público renderiza links ativos por plataforma | TODO | P1-16 |
| Catalog | adicionar itens e exibir catálogo | Editor permite criar/editar/remover item de catálogo; público renderiza grade/lista de itens com CTA | TODO | P1-1 |
| Form | captação de lead/contato | Editor permite configurar formulário e público envia submissão válida com feedback de sucesso/erro | TODO | P1-2 |

## Reliability/Quality Gates

| Area | Required Acceptance Criteria | Status | Backlog |
|---|---|---|---|
| API ownership security | Rotas mutáveis validam dono corretamente por escopo de recurso | DONE | P0-4 |
| Test baseline | Suite mínima ativa para helpers críticos de API | DONE | P0-3 |
| Core smoke E2E | Fluxo create→edit→publish→view automatizado via smoke test | DONE | P0-6 |

## How to Use During Execution

1. Antes de iniciar item P1/P2, referenciar a linha correspondente desta matriz.
2. Entregar código + validação cobrindo os critérios de aceite da linha.
3. Atualizar `Status` da linha e linkar evidência (testes/screenshots/log) no `docs/04_SESSION_LOG.md`.
4. Só marcar tarefa do backlog como `DONE` quando critérios da linha estiverem satisfeitos.

## Evidence Sources (Keepo Discovery)

- `keepo-feature-deep3.json`
- `keepo-links-catalog-deep.json`
- `keepo-publish-result.png`
- `keepo-public-pulseqa330586.png`
- `keepo-links-editor-filled.png`
