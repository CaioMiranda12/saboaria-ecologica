# Sprint 10 — Segurança administrativa (primeira etapa)

- Limitação de tentativas de login por e-mail e IP (persistida em PostgreSQL).
- Invalidação de sessões por versão de token; alteração de senha revoga sessões anteriores.
- Botão administrativo para encerrar todas as sessões de um usuário, com confirmação e auditoria.
- Migration aditiva `20261123235000_admin_security`.

## Aplicação

```bash
npm install
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npm run build
```

## Limites e próximas etapas

A recuperação autônoma de senha por e-mail ainda não está implementada: exige configurar provedor de e-mail e fluxo de token único. Administradores já podem redefinir senhas na gestão de usuários; isso agora revoga sessões existentes.
A limitação por IP depende de cabeçalho confiável do proxy; a limitação por e-mail é independente. Os registros de tentativas devem ser periodicamente limpos.
