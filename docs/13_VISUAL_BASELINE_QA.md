# 13_VISUAL_BASELINE_QA.md

## Objetivo
Consolidar baseline visual de QA pesado (P6) para comparação manual entre rodadas, focando rotas críticas deslogadas e logadas.

## Evidências atuais (artefatos locais)

### Deslogado
- Landing (mobile): `/home/claw/.openclaw/media/browser/33553f6b-86df-410a-a7a8-c6160db74353.jpg`
- Login (mobile): `/home/claw/.openclaw/media/browser/4ea5518d-c8db-4a2e-8e4e-0ddf34645df6.png`
- Register (desktop): `/home/claw/.openclaw/media/browser/1ade563e-3127-45f3-8ad0-caf78d435335.png`
- Redirect dashboard→login (desktop): `/home/claw/.openclaw/media/browser/13e13194-d100-42c4-b212-db4c4bae8e5f.png`

### Logado
- Dashboard: `/home/claw/.openclaw/media/browser/28b00864-f61d-4b3d-a79b-0d198da5eb23.png`
- Editor (onboarding): `/home/claw/.openclaw/media/browser/7b01afd8-9e7f-46fb-b8ee-649c7ab95a0a.png`
- Analytics: `/home/claw/.openclaw/media/browser/49cd1a56-e0f3-442e-a3cc-d209d27abd1d.png`
- Settings: `/home/claw/.openclaw/media/browser/1f6fff72-9e35-4d04-928f-dbb5b349a00f.png`

## Checklist de comparação manual (diff guiado)

Em cada nova rodada P6, comparar visualmente com o baseline:

- [ ] Sem overflow horizontal
- [ ] Sem imagem quebrada
- [ ] CTA principal visível no primeiro viewport mobile
- [ ] Hierarquia de títulos e espaçamento consistente
- [ ] Elementos críticos do dashboard/editor acessíveis no mobile
- [ ] Sem regressão de idioma (PT-BR)

## Fluxo recomendado de atualização

1. Rodar `npm run qa:p6-route-matrix`.
2. Capturar screenshots novas (deslogado + logado) por rota crítica.
3. Comparar com este baseline usando checklist acima.
4. Se houver regressão, registrar em `docs/04_SESSION_LOG.md` com impacto e plano de correção.
5. Se não houver regressão relevante, atualizar os caminhos dos artefatos quando necessário.
