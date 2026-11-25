# Sprint 9 — Gestão de usuários

## Entregas

- `/admin/usuarios`: listagem, criação, edição de perfil e nome, troca de senha e exclusão com modal personalizado.
- Endpoints protegidos `/api/admin/usuarios` e `/api/admin/usuarios/[id]`.
- Senhas protegidas com bcrypt; respostas da API nunca incluem hash.
- Auditoria de criação, edição e exclusão de contas.
- Bloqueio de exclusão da própria conta e de remoção do último administrador.
- Verificação de existência da conta em cada leitura de sessão, invalidando cookies de usuários excluídos.

## Instalação

1. Preserve o `.env` existente.
2. `npm install`
3. `npx prisma generate --config prisma7.config.ts`
4. `npm run build`
5. `npm run dev`

Sem migration nova. Use uma conta ADMIN para acessar `/admin/usuarios`.

## Testes manuais

- Cadastrar um editor e fazer login com a nova conta.
- Confirmar que editor não consegue abrir `/admin/usuarios` ou acessar API de usuários.
- Editar nome/perfil/senha, testar novo login.
- Excluir um usuário com o modal e confirmar o bloqueio da sessão excluída.
- Conferir eventos em `/admin/auditoria`.
- Confirmar que não é possível excluir a própria conta ou rebaixar o último administrador.

## Limitações

- Ainda não há convite por e-mail nem recuperação de senha autônoma.
- A mudança de senha não invalida automaticamente tokens já emitidos; exclusão da conta invalida.
- Operações de usuário e auditoria são gravadas separadamente, não em transação atômica.
- Testes reais contra o Neon e de ponta a ponta devem ser feitos no ambiente configurado.
