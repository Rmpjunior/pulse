# 12_HEAVY_TEST_ROADMAP.md

## Objetivo
Executar auditoria pesada de qualidade no Pulse cobrindo navegação deslogada/logada, ações críticas, responsividade mobile, regressão visual e estabilidade em CI/deploy.

## Escopo de teste (obrigatório)

### A) Navegação deslogada
- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/p/[username]` válido e inválido

Checklist por rota:
- sem overflow horizontal
- sem imagens quebradas
- contraste e legibilidade (claro/escuro)
- spacing consistente (cards, botões, títulos)
- CTA principal visível no primeiro viewport mobile

### B) Navegação logada (conta FREE)
- `/dashboard`
- `/dashboard/editor`
- `/dashboard/analytics`
- `/dashboard/settings`
- `/dashboard/subscription`

Checklist por rota:
- sem overflow horizontal
- sem elementos “flutuando” fora de contexto no mobile
- sidebar/drawer com altura completa e scroll funcional
- ações primárias acessíveis no mobile
- sem textos em inglês residuais

### C) Fluxos críticos (ações)
1. cadastro por credenciais
2. login por credenciais
3. login com Google (quando habilitado)
4. criação da 1ª página
5. criação da 2ª/3ª página (multi-site)
6. troca de contexto por `pageId`
7. edição + salvar + publicar/despublicar
8. copiar link + abrir página pública
9. reset de senha (fluxo backend + feedback UI)
10. exclusão de conta (confirmação forte)

### D) Visual QA / Design polish
- revisão de hero/features/how-it-works/pricing/auth visuals
- validação em tema claro/escuro
- verificar cortes, crop ruim, blur excessivo, desalinhamento
- validar tipografia e hierarquia visual

## Automação (roadmap técnico)

### 1) Playwright audit suite (curto prazo)
- script de varredura mobile/tablet/desktop
- detecção de:
  - overflow X
  - imagens quebradas
  - elementos fora da viewport
- captura de screenshot por rota e estado

### 2) E2E funcional expandido (curto-médio prazo)
- ampliar suite atual (`creator-journey`) para:
  - multi-site completo
  - settings críticos
  - analytics/gating

### 3) CI de interface (médio prazo)
- manter quality-gates atual (lint/test/build)
- adicionar job dedicado E2E headless
- avaliar Cypress vs Playwright:
  - prioridade: menor atrito e maior estabilidade no ambiente atual
  - se Cypress for adotado, incluir smoke mínimo no CI com retries

## Backlog operacional sugerido
- P6-1: Test matrix deslogado/logado (mobile-first) com evidências automáticas
- P6-2: Multi-site stress (3 páginas + alternância + edição/publicação em sequência)
- P6-3: Visual regression baseline (landing + dashboard + editor + settings)
- P6-4: Theme audit (claro/escuro) e contraste
- P6-5: PT-BR full audit final (UI + toasts + erros + placeholders)
- P6-6: CI E2E job (Playwright/Cypress) com relatório artefato

## Critério de saída
Uma rodada só é considerada concluída quando:
- lint/test/build verdes
- deploy Vercel em success
- sem regressão visual crítica nas screenshots comparativas
- log da sessão atualizado em `docs/04_SESSION_LOG.md`
