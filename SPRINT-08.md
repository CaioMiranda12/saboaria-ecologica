# Sprint 8 — Segurança e auditoria administrativa

## Implementado

- Perfis `ADMIN` e `EDITOR` no banco; administradores existentes permanecem `ADMIN`.
- Exclusões de produtos, equipe e parcerias restritas a `ADMIN` no servidor.
- Eventos de criação, edição e exclusão registrados com identidade do usuário e data.
- Tela `/admin/auditoria` com os últimos 100 eventos, visível somente a administradores.
- Modais personalizados já existentes na Sprint 7.1 preservados.

## Limites conhecidos

- Não há interface de criação/edição de usuários e papéis nesta entrega. Alterar papéis requer operação administrativa segura no banco.
- O log de auditoria não é transacional com a escrita principal; se o registro do log falhar após a alteração, a API retorna erro mesmo que a alteração tenha ocorrido. Recomenda-se migrar para transações na próxima evolução.
- O log novo cobre produtos, equipe e parcerias; publicação CMS usa seu histórico específico. Upload de mídia, conteúdo global e autenticação ainda não geram eventos neste log.
- A auditoria não recupera eventos anteriores à migration. Não foram realizados testes end-to-end com Neon/Cloudinary reais.

## Atualização

1. Backup do Neon e preservação do `.env`.
2. `npm install`
3. `npx prisma migrate deploy --config prisma7.config.ts`
4. `npx prisma generate --config prisma7.config.ts`
5. `npm run build` e `npm run dev`

Commit: `feat(admin): sprint 08 - permissoes e auditoria administrativa`
