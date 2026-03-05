#!/usr/bin/env bash
set -euo pipefail

# Referência operacional para skills de qualidade frontend usadas no Pulse.
# Observação: este script documenta a intenção de uso no ciclo;
# a instalação/execução depende do ambiente OpenClaw/ClawHub disponível.

SKILLS=(
  "vercel-react-best-practices"
  "web-design-guidelines"
  "frontend-design"
)

echo "Skills-alvo do ciclo frontend:" >&2
for skill in "${SKILLS[@]}"; do
  echo "- ${skill}" >&2
done

echo >&2
echo "Checklist aplicado nesta sessão:" >&2
echo "1) Hierarquia visual e contraste de CTA" >&2
echo "2) Scannability mobile (cards curtos e seções objetivas)" >&2
echo "3) Prova de valor acima da dobra" >&2
echo "4) Microcopy PT-BR orientado a ação" >&2
