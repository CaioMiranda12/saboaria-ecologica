# Sprint 10.3 — Minha Conta

## Implementado

- Página `/admin/minha-conta` acessível a ADMIN e EDITOR.
- Navegação no menu lateral e móvel.
- Edição do próprio nome, com validação no servidor.
- Alteração da própria senha mediante confirmação da senha atual, mínimo de 12 caracteres, bcrypt e incremento de `sessionVersion` para invalidar sessões anteriores.
- Consulta ao e-mail, papel, data de criação e data de atualização.
- Registro de eventos de perfil e senha na auditoria, sem armazenar senhas.
- Interface responsiva com identidade visual verde.

## Atualização

Não há migration nem novas dependências. Preserve o `.env` e execute `npm install`, `npx prisma generate --config prisma7.config.ts`, `npm run build` e `npm run dev`.

## Testes

1. Acesse `/admin/minha-conta` como ADMIN e EDITOR.
2. Edite o nome e confira a persistência após atualizar a página.
3. Teste senha atual incorreta, senha curta e confirmação divergente.
4. Altere a senha e confirme que a sessão antiga perde acesso e o novo login funciona.
5. Confirme que e-mail e papel não podem ser editados por esta API.
6. Confira os eventos `UPDATE_PROFILE` e `CHANGE_PASSWORD` em auditoria.

## Limitações

A aplicação não oferece lista de dispositivos ou sessões individuais. O controle é por versão de sessão; alterar a senha invalida todas as sessões. A auditoria é registrada após a operação, não na mesma transação.
