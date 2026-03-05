# Frontend Quality Playbook (P4-2)

Baseado nas skills de referência do ciclo (`skills.sh`):
- `vercel-react-best-practices`
- `web-design-guidelines`
- `frontend-design`

## Regras aplicadas no Pulse

1. **Mensagem de valor em até 5 segundos**
   - Hero com benefício principal + CTA primário claro.
2. **Escaneabilidade mobile-first**
   - Blocos curtos, bullets objetivos e hierarchy visual evidente.
3. **Prova de valor acima da dobra**
   - Indicadores rápidos de resultado/confiança já no topo da landing.
4. **Consistência de CTA**
   - Um CTA principal por seção; secundário apenas para apoio.
5. **Microcopy PT-BR orientado a ação**
   - Evitar texto genérico; explicar o próximo passo.

## Aplicação nesta sessão

- Landing ganhou:
  - faixa de "sinais de confiança" no hero,
  - seção "Como funciona" com 3 passos,
  - melhoria de hierarquia visual para reduzir aparência genérica.
- Conteúdo textual foi adicionado em `src/i18n/messages/pt-BR.json` para manter governança de idioma.

## DoD para futuras entregas de frontend

- [ ] CTA principal visível sem rolagem no mobile
- [ ] Seções com objetivo claro (benefício, funcionamento, preço)
- [ ] Linguagem PT-BR sem inglês residual visível
- [ ] `npm run lint` sem erros
- [ ] `npm run build` ok
