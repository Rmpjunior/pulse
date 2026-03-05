# Google Auth — Checklist de Produção

Objetivo: garantir que login/cadastro com Google funcione ponta a ponta sem quebrar fallback por e-mail/senha.

## 1) Variáveis obrigatórias (sem elas Google fica desativado)

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

## 2) Variáveis recomendadas para produção

- `AUTH_SECRET`
- `AUTH_TRUST_HOST=true`
- `NEXTAUTH_URL=https://SEU_DOMINIO`

## 3) Checklist no Google Cloud Console

1. Criar OAuth Client (tipo Web Application)
2. Authorized JavaScript origin: `https://SEU_DOMINIO`
3. Authorized redirect URI:
   - `https://SEU_DOMINIO/api/auth/callback/google`
4. Publicar app (ou manter em Testing com usuários permitidos)

## 4) Validação manual ponta a ponta

1. Acessar `/login` e confirmar botão "Entrar com Google"
2. Fazer login via Google e validar redirecionamento para `/dashboard`
3. Fazer logout
4. Acessar `/register` e repetir fluxo Google
5. Remover temporariamente `AUTH_GOOGLE_ID/SECRET` no ambiente de teste e validar fallback:
   - botão Google some
   - login/cadastro por e-mail e senha continua funcionando

## 5) Regra implementada no código

- O provider Google só é montado quando `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` existem.
- As telas de login/cadastro usam a mesma regra do servidor (sem depender de flag client-side separada), evitando inconsistência visual.
