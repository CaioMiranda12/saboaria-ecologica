# Sprint 7.1 — Auditoria e modais

## Alterações

- Histórico de versões registra identificador, nome e e-mail do administrador responsável pela publicação ou restauração.
- Restaurações são registradas como ações próprias e continuam sem alterar o site público até publicação.
- Registros anteriores sem autoria permanecem explicitamente identificados como não atribuídos.
- Confirmações de publicação e restauração usam o componente visual ConfirmDialog, sem `window.confirm`.
- Modal compartilhado com Escape, foco inicial, navegação por Tab, bloqueio de rolagem e restauração de foco.

## Atualização

1. Faça backup do Neon.
2. Preserve seu `.env` (não incluído).
3. `npm install`
4. `npx prisma migrate deploy --config prisma7.config.ts`
5. `npx prisma generate --config prisma7.config.ts`
6. `npm run build` e `npm run dev`

## Limites

- Esta entrega audita publicação e restauração no CMS; ainda não audita cada salvamento de rascunho, alteração de produtos ou gestão de usuários.
- Os registros anteriores não permitem descobrir quem executou a ação.
- Validar as operações reais no Neon e o build no ambiente de destino.
