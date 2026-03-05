# P4-3 — Revisão visual de imagens/ícones + prompts prontos (IA externa)

Data: 2026-03-05
Escopo: landing + auth + dashboard/editor + página pública.

## 1) Diagnóstico rápido (pontos fracos visuais)

## A. Identidade visual repetitiva/genérica
- Uso muito frequente de `Sparkles` + `gradient-primary` em várias superfícies (landing, auth, sidebar, not-found).
- Efeito: aparência de template genérico e baixa diferenciação de marca.

## B. Dependência de imagens por URL sem direção estética
- Avatares/capas/produtos dependem de links externos inseridos manualmente.
- Efeito: resultado final inconsistente entre usuários (qualidade, estilo, recorte, contraste).

## C. Ícones sociais ainda textuais/abreviados em parte dos fluxos
- Há render funcional, mas sem kit visual de marca padronizado por plataforma.
- Efeito: percepção de “acabamento incompleto”.

## D. Hero sem mockup realista do produto
- Preview atual da landing usa wireframe abstrato.
- Efeito: reduz percepção de qualidade/produto real.

## E. Ausência de biblioteca base de assets
- Não existe conjunto oficial de: avatars demo, thumbnails demo, mockups de device e ilustrações por contexto.
- Efeito: cada tela resolve visual de forma ad-hoc.

---

## 2) Inventário por superfície (onde priorizar troca de assets)

1. **Landing (`src/app/[locale]/page.tsx`)**
   - Hero preview (mockup principal)
   - Cards de features (ícones/apoios visuais)

2. **Auth (`src/app/[locale]/(auth)/*`)**
   - Bloco de branding visual (pode evoluir do ícone único para símbolo + ilustração leve)

3. **Dashboard/Editor**
   - Avatar placeholders e imagens de exemplo
   - Kits de thumbnails para links/catalog

4. **Página pública (`src/app/[locale]/p/[username]/page-content.tsx`)**
   - Consistência de avatar/capas e ícones sociais (kit oficial)

---

## 3) Prompt pack pronto para IA externa

> Recomendação: gerar em PNG/WebP, fundo transparente quando fizer sentido, variações 1x/2x.

## Prompt 01 — Hero mockup (mobile minisite realista)
"Crie um mockup de smartphone moderno exibindo um minisite de criador brasileiro. Estilo premium, limpo, vibrante, fundo claro, UI em português. Mostrar avatar circular, nome, bio curta, 3 botões de link com microícones, seção de produto com preço em real (R$), seção social. Composição centralizada para landing page SaaS. Alta nitidez, iluminação suave, sem marca d'água, sem texto ilegível, sem logos de terceiros."

## Prompt 02 — Conjunto de avatares demo (diversidade BR)
"Gere 12 avatares fotográficos estilizados (headshot) com diversidade brasileira: tons de pele, faixas etárias, gêneros e estilos. Fundo neutro, enquadramento de ombro para cima, expressão amigável/profissional, iluminação natural, alta qualidade, formato quadrado, sem marcas, sem texto."

## Prompt 03 — Thumbnails de catálogo (pack)
"Crie um pack com 18 thumbnails de produtos digitais e serviços para criadores (mentoria, ebook, curso, presets, consultoria, agenda). Estilo visual consistente, moderno, cores equilibradas, composição minimalista, pronto para cards pequenos. Sem texto extenso, sem logos de marca real, fundo limpo."

## Prompt 04 — Ilustrações de recursos (features)
"Produza 6 ilustrações flat-modern para funcionalidades de um construtor de bio page: links, mídia, catálogo, analytics, formulário, temas. Paleta quente com contraste acessível, traço consistente, sem aparência infantil. Cada ilustração isolada em fundo transparente, proporção 1:1."

## Prompt 05 — Ícones sociais estilizados (fallback não-oficial)
"Desenhe um set de ícones sociais minimalistas e consistentes (instagram, youtube, tiktok, linkedin, x, whatsapp, facebook) em estilo mono + versão preenchida, traço uniforme, legível em 24px e 16px, fundo transparente, sem uso de logotipos protegidos literais."

## Prompt 06 — Background abstrato para auth
"Crie 3 variações de background abstrato suave para telas de login/cadastro de SaaS. Gradientes orgânicos discretos, aparência premium, baixa distração, boa leitura com card branco no centro, resolução desktop e mobile."

---

## 4) Especificação de entrega para Roberto/time de design

- Formatos:
  - PNG (transparente quando aplicável)
  - WebP otimizado para produção
- Tamanhos mínimos:
  - Hero mockup: 1600x1200
  - Avatares demo: 512x512
  - Thumbnails catálogo: 800x800
  - Ilustrações feature: 1024x1024
  - Background auth: 1920x1080 + 1080x1920
- Critérios de aceite:
  - Consistência de estilo entre pack
  - Legibilidade em mobile
  - Sem marcas d'água
  - Sem elementos com direitos autorais restritos

---

## 5) Plano de aplicação (ponte para P4-4)

1. Receber assets gerados e versionar em `public/assets/...`
2. Trocar hero mockup e ilustrações da landing
3. Introduzir placeholders oficiais (avatar/catalog) no editor/página pública
4. Validar em breakpoints mobile/desktop
5. Rodar `npm run lint` + `npm run build`
6. Capturar screenshots antes/depois para comparação objetiva
