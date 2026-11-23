# Sprint 9.8 — Consolidação segura do CMS

## Alterações
- Removido o atalho redundante de `/admin/conteudo` do menu e da visão geral.
- `/admin/paginas` passa a ser a entrada central para editar o site.
- `/admin/conteudo` agora é um arquivo de consulta **somente leitura**, restrito a `ADMIN`.
- Os dez campos históricos são exibidos com indicação do editor moderno mais próximo; a correspondência é orientativa e deve ser revisada.
- Exportação JSON do registro legado em `/api/admin/site-content/export` com autenticação e sem cache.
- A API antiga `PATCH /api/admin/site-content` retorna HTTP 410; a consulta GET exige ADMIN.
- Nenhuma tabela ou dado foi removido; nenhuma migração automática altera rascunhos ou publicações.

## Atualização
```bash
npm install
npx prisma generate --config prisma7.config.ts
npm run build
npm run dev
```
Não há migration nesta sprint.

## Testes recomendados
1. Entrar como ADMIN, abrir `/admin/paginas`, acessar o arquivo legado e exportar o JSON.
2. Verificar que as informações antigas são preservadas e que a exportação contém `format`, `exportedAt` e `content`.
3. Verificar que `EDITOR` não consegue consultar o arquivo nem exportá-lo.
4. Confirmar que `PATCH /api/admin/site-content` responde 410 e não modifica o banco.
5. Editar e publicar uma página do CMS; confirmar que a publicação permanece independente do arquivo.
6. Conferir o menu e o dashboard sem a entrada duplicada.

## Limitações e próximos passos
A migração de conteúdo legado para os campos atuais exige validação humana, pois as estruturas não são equivalentes. O histórico não foi apagado. Após revisão e backup, a remoção da tabela antiga poderá ser planejada em sprint posterior.

## Commit
`refactor(cms): sprint 09.8 - consolidacao segura do conteudo legado`
